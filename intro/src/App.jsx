import React from 'react';
import logo from './logo.svg';
import './App.css';
import Inspector from 'react-inspector';
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-ruby";
import "prismjs/themes/prism.css";
import _basics from "../../basics.rb";
const basics = _basics.split("\n").slice(4).join("\n");
const ls = basics.split("\n");

let stepping = false;
function App() {
    const [started, setStarted] = React.useState(false);
    const [vars, setVars] = React.useState({});
    const [_stack, setStack] = React.useState([{ linenum: 0, fname: "" }]);
    const [_stdin, setStdin] = React.useState("");
    const stack = _stack.map((el) => {
        let linenum = el.linenum + 1;
        while (linenum < 100 && (ls[linenum - 1] || "").length < 1) {
            linenum++;
        }
        console.log(linenum, el.linenum);
        return { linenum, fname: el.fname };
    });
    const { linenum } = stack[0];
    const reset = () => {};
    const step = (e) => {
        e.preventDefault();
        if (stepping) { return; }
        stepping = true;
        if (!started) {
            setStdin("");
            setVars({});
            setStarted(true);
        }
        fetch(started ? '/step' : '/start')
            .then(response => response.json())
            .then(({ stack, vars, stdin, done }) => {
                setStdin((!started ? "" : _stdin) + (stdin || ""));
                if (!done) {
                    setVars(vars);
                    setStack(stack);
                }
                if (done) {
                    setStack([{ linenum: 0, fname: "" }]);
                    setStarted(false);
                }
                stepping = false;
            });
    };
    const stdin = _stdin;
    return (
        <div className="page" >
          <div style={{
              display: "flex",
              flexDirection: "row",
          }}>
            <div style ={{ flex: "2" }}>
              <div className="editor">
                <div className="header">
                  <div>Editor</div>
                  <div className="spacer" />
                  <div className="spacer" />
                  <div className="spacer" />
                  <div className="spacer" />
                  <a onClick={reset} href={started ? "" : null}>Reset</a>
                  <div className="spacer" />
                  <a onClick={step} href={""}>Step</a>
                  <div className="spacer" />
                </div>
                <div className="ta">
                  <div>
                    <Editor
                      onValueChange={(code) => {}}
                      highlight={code =>
                          highlight(code, languages.ruby)
                              .split('\n')
                              .map((line, i) =>
                                  `<span class="container_editor_line_number ${i + 1 === linenum ? "hlight" : ""}">${line}</span>`
                              ).join('\n')
                      }
                      value={basics}
                      padding={10}
                      style={{
                          fontFamily: '"Fira code", "Fira Mono", monospace',
                          fontSize: 12,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div style ={{ flex: "1", display: "flex", flexDirection: "column" }}>
              <div className="editor">
                <div className="header">
                  <div>Variables</div>
                  <div className="spacer" />
                  <button style={{ visibility: "hidden" }} >i</button>
                </div>
                <div className="ta ta2">
                  <div>
                    <Inspector data={vars} />
                  </div>
                </div>
              </div>
              <div className="editor">
                <div className="header">
                  <div>Stack</div>
                  <div className="spacer" />
                  <button style={{ visibility: "hidden" }} >i</button>
                </div>
                <div className="ta ta2">
                  {!started ? <div/> : (
                      <table style={{ margin: "auto" }} className="table">
                        <tr>
                          <th>Function</th>
                          <th>Line Number</th>
                        </tr>
                        {stack.reverse().map(({ fname, linenum }) => <tr><td>{fname === "" ? <italic>toplevel</italic> : fname}</td><td>{linenum}</td></tr>)}
                      </table>
                  )}
                </div>
              </div>
              <div className="editor">
                <div className="header">
                  <div>Output</div>
                <div className="spacer" />
                <button style={{ visibility: "hidden" }} >i</button>
              </div>
              <div className="ta ta2">
                <div>
                  {stdin}
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
    );
}

export default App;
