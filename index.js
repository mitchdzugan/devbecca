const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
const { spawn } = require("child_process");
const fs = require('fs');

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
    <script>window.serverData = ${JSON.stringify(serverData)}</script>
    ${js}
  </body>
</html>
`;
        res.setHeader('Content-Type', 'text/html');
        res.end(html);
    });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.use('/static/js', express.static('intro/build/static/js'));
app.use('/static/css', express.static('intro/build/static/css'));


const STEP = (res) => {
    if (!CURR) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: "NOT STARTED" }));
        return;
    }
    CURR.step().then(({ stdin, done }) => {
        if (done) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ done: true, stdin }));
            return;
        }
        CURR.getStats().then(result => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ...result, stdin }));
        });
    });
};

const START = (res, steps = 1) => {
	  const proc = spawn("ruby", ["./basics.rb"]);
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
        if (step && ins.endsWith("> ")) {
            step = false;
            resolve({ stdin, done: false });
            stdin = "";
            return;
        }
        if (step && !ins.endsWith("step\n")) {
            stdin += ins;
        }
        if (backtrace && ins.startsWith("--> ")) {
            const stack = ins
                  .trim().split("\n")
                  .map(s => {
                      const parts = s.substr(4).trim().split(" ");
                      const linenum = parseInt(parts[4].reverse().split(":")[0].reverse()) - 5;
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
        if (json && ins.startsWith("=> ")) {
            json = false;
            const vars = JSON.parse(JSON.parse(ins.substr(2).trim()));
            Object.keys(vars).forEach(k => {
                if (vars[k] === null) { return; }
                fullVars[k] = vars[k];
            });
            backtrace = true;
            proc.stdin.write("backtrace\n");
            return;
        }
        if (localVars && ins.startsWith("=> ")) {
            localVars = false;
            const vars = ins
                  .substr(2).trim()
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
        if (required && ins.startsWith("=> ")) {
            required = false;
            stdin = "";
            const loop = (count, done) => {
                if (!count) {
                    return done();
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
            loop(steps - 1, () => STEP(res));
            return;
        }
        if (!started && ins.trim() === '[1] pry(main)>') {
            started = true;
            required = true;
            proc.stdin.write("require \"json\"\n");
            return;
        }
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
app.get('/step', (req, res) => STEP(res));
app.get('/start', (req, res) => {
    if (CURR) { return STEP(res); }
    return START(res);
});
app.get('/rewind', (req, res) => {
    if (CURR) { return START(res, CURR.steps - 1); }
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: "NOT STARTED" }));
    return {};
});
