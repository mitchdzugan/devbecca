const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const { spawn } = require("child_process");

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
app.get('/step', (req, res) => {
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
});
app.get('/start', (req, res) => {
	  const proc = spawn("ruby", ["./basics.rb"]);
    let started = false;
    let required = false;
    let localVars = false;
    let backtrace = false;
    let json = false;
    let step = false;
    let stdin = "";
    const fullVars = {};
    let resolve;
    CURR = {
        step: () => {
            const p = new Promise((r => { resolve = r; }));
            step = true;
            proc.stdin.write("step\n");
            return p;
        },
        getStats: () => {
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
        if (step && ins !== "step\n") {
            stdin += ins;
        }
        if (backtrace && ins.startsWith("--> ")) {
            const stack = ins
                  .trim().split("\n")
                  .map(s => parseInt(s.trim().reverse().split(":")[0].reverse()) - 5);
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
            CURR.getStats().then(result => {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(result));
            });
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
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

