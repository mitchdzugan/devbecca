const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 8000;
const { spawn } = require("child_process");
const fs = require('fs');
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const clients = {};
let nextId = 1;

io.on('connection', (socket) => {
    const id = nextId;
    nextId++;
    clients[id] = socket;
    socket.emit("ID", JSON.stringify({ id }));
    socket.on('disconnect', () => { delete clients[id]; });
});

const isPrompt = s => s.startsWith("[") && s.endsWith("> ");
const isTrimPrompt = s => s.startsWith("[") && s.endsWith(">");

app.get('/', (req, res) => {
  res.send('Hello World!');
});

String.prototype.reverse = function () {
    return this.split("").reverse().join("");
};

let CURR;
const IGNORE = {
    "_": true,
    "__": true,
    "_dir_": true,
    "_file_": true,
    "_ex_": true,
    "_pry_": true,
    "_out_": true,
    "_in_": true,
};
app.get('/intro', (req, res) => {
    const p = new Promise(resolve => CURR ? CURR.getStats().then(v => resolve(v)) : resolve({ stopped: true }));
    const css = fs.readdirSync("./intro/build/static/css")
          .filter(f => f.endsWith("css"))
          .map(f => `/static/css/${f}`)
          .map(css => `<link rel="stylesheet" href="${css}">`)
          .join("\n");
    const js = fs.readdirSync("./intro/build/static/js")
          .filter(f => f.endsWith("js"))
          .map(f => `/static/js/${f}`)
          .map(js => `<script src="${js}"></script>`)
          .join("\n");
    p.then((serverData) => {
        const html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta
      name="description"
      content="Web site created using create-react-app"
    />
    <link rel="apple-touch-icon" href="/logo192.png" />
    <link rel="manifest" href="/manifest.json" />
    <title>Intro</title>
    ${css}
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
    <script>window.serverData = ${JSON.stringify({ ...serverData, codeId: CURR ? CURR.codeId : "basics" })}</script>
    ${js}
  </body>
</html>
`;
        res.setHeader('Content-Type', 'text/html');
        res.end(html);
    });
});

server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.use('/static/js', express.static('intro/build/static/js'));
app.use('/static/css', express.static('intro/build/static/css'));


const STEP = (req, res) => {
    console.log(req.query);
    if (!CURR) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: "NOT STARTED" }));
        return;
    }
    CURR.step().then(({ stdin, done }) => {
        if (done) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ done: true, stdin }));
            Object.keys(clients).forEach(clientId => {
                if (`${clientId}` === req.query.id) {
                    return;
                }
                const client = clients[clientId];
                client.emit('DATA', JSON.stringify({ done: true, stdin, codeId: CURR.codeId }));
            });
            return;
        }
        CURR.getStats().then(result => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ...result, stdin }));
            Object.keys(clients).forEach(clientId => {
                if (`${clientId}` === req.query.id) {
                    return;
                }
                const client = clients[clientId];
                client.emit('DATA', JSON.stringify({ ...result, stdin, codeId: CURR.codeId }));
            });
        });
    });
};

const START = (req, res, steps = 1, rawCodeId = "basics") => {
    const codeId = req.query.code || rawCodeId;
	  const proc = spawn("ruby", [`./${codeId}.rb`]);
    let sofar = "";
    let started = false;
    let required = false;
    let localVars = false;
    let backtrace = false;
    let json = false;
    let step = false;
    let stdin = "";
    let fullVars = {};
    let resolve;
    CURR = {
        codeId,
        steps: 0,
        step: () => {
            const p = new Promise((r => { resolve = r; }));
            step = true;
            proc.stdin.write("step\n");
            return p.then(r => {
                if (!CURR) { return r; }
                CURR.steps += 1;
                return r;
            });
        },
        getStats: () => {
            fullVars = {};
            const p = new Promise((r => { resolve = r; }));
            localVars = true;
            proc.stdin.write("local_variables\n");
            return p;
        }
    };
    proc.stdout.on("data", data => {
        const ins = data.toString("utf-8").replace(
            /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
            ''
        );
    });
    const PROC = (ins) => {
        // console.log({ ins, step, started, required, localVars, backtrace, json, step, stdin, fullVars });
        if (step && ins.endsWith("> ")) {
            step = false;
            resolve({ stdin, done: false });
            stdin = "";
            return;
        }
        if (step) {
            let news = (ins.split("step\n")[1] || ins).trim();
            if (news !== "") {
                news.split("\n").forEach(s => {
                    if (!isTrimPrompt(s.trim()) && s.trim() !== "step" && s.trim() !== "") {
                        stdin += s.trim() + "\n";
                    }
                });
            }
        }
        if (backtrace && ins.split("\n").some(s => s.trim().startsWith("--> "))) {
            let backtraces = "";
            let inBacktraces = false;
            ins.split("\n").forEach(s => {
                if (s.startsWith("--> ")) {
                    inBacktraces = true;
                }
                if (inBacktraces) {
                    backtraces += s + "\n";
                }
            });
            const stack = backtraces
                  .trim().split("\n")
                  .map(s => {
                      const parts = s.substr(4).trim().split(" ");
                      const linenum = parseInt(s.trim().reverse().split(":")[0].reverse()) - 5;
                      const name = parts[2];
                      let fname;
                      if (name === "<main>") {
                          fname = "";
                      } else {
                          fname = name.substr(7, name.indexOf("(") - 7);
                      }
                      return { fname, linenum };
                  });
            backtrace = false;
            resolve({ stack, vars: fullVars });
            return;
        }
        if (json && ins.split("\n").some(s => s.trim().startsWith("=> "))) {
            json = false;
            let jsons = "";
            let inJsons = false;
            ins.split("\n").forEach(s => {
                if (s.startsWith("=> ")) {
                    jsons += s.substr(3);
                    inJsons = true;
                } else if (inJsons) {
                    jsons += s;
                }
            });
            const vars = JSON.parse(JSON.parse(jsons));
            Object.keys(vars).forEach(k => {
                if (vars[k] === null) { return; }
                fullVars[k] = vars[k];
            });
            backtrace = true;
            proc.stdin.write("backtrace\n");
            return;
        }
        if (localVars && ins.split("=> ").length === 2) {
            localVars = false;
            const vars = ins
                  .split("=> ")[1]
                  .trim()
                  .substr(1)
                  .reverse().substr(1).reverse()
                  .split(",")
                  .map(s => s.trim().substr(1).trim())
                  .filter(s => !IGNORE[s]);
            let cmd = "JSON.generate({";
            vars.forEach(v => {
                cmd += ` "${v}" => ${v}, `;
            });
            cmd += "})\n";
            json = true;
            proc.stdin.write(cmd);
            return;
        }
        if (required && ins.split("\n").some(s => s.trim().startsWith("=> "))) {
            required = false;
            stdin = "";
            const loop = (count, done) => {
                if (!count) {
                    return setTimeout(done, 100);
                }
                if (!CURR) {
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ vars: {}, done: true, stdin }));
                    return {};
                }
                return CURR.step().then(res => {
                    stdin += res.stdin;
                    loop(count - 1, done);
                });
            };
            loop(steps - 1, () => STEP(req, res));
            return;
        }
        if (!started && ins.trim() === '[1] pry(main)>') {
            started = true;
            required = true;
            proc.stdin.write("require \"json\"\n");
            return;
        }
    };
    proc.stdout.on("data", data => {
        const ins = data.toString("utf-8").replace(
            /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
            ''
        );
        ins.split("\n").forEach(s => {
            if (isPrompt(s)) {
                PROC(sofar);
                PROC(s);
                sofar = "";
            }
            else {
                sofar += s + "\n";
            }
        });
    });
    proc.on('close', () => {
        resolve({ stdin, done: true });
        CURR = undefined;
    });
};

app.get('/reset', (req, res) => {
    CURR = undefined;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: true }));
});
app.get('/step', (req, res) => STEP(req, res));
app.get('/start', (req, res) => {
    if (CURR) { CURR = undefined; }
    return START(req, res);
});
app.get('/rewind', (req, res) => {
    if (CURR) { return START(req, res, CURR.steps - 1, CURR.codeId); }
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: "NOT STARTED" }));
    return {};
});
