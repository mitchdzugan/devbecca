import logo from './logo.svg';
import './App.css';
import Inspector from 'react-inspector';
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-ruby";
import "prismjs/themes/prism.css";
console.log({ languages });

function App() {
    const data = { a: 1 };
    return (
        <div className="page" >
            <div style={{
                display: "flex",
                flexDirection: "row",
            }}>
                <div style ={{ flex: "1" }}>
                    <div className="editor">
                        <div className="header">
                            <div>Editor</div>
                            <div className="spacer" />
                        </div>
                        <div className="ta">
                            <div>
                                <Editor
                                    onValueChange={(code) => {}}
                                    highlight={(code) => highlight(code, languages.ruby)}
                                    value={"puts 1"}
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
                <div style ={{ flex: "1" }}>
                    <div className="editor">
                        <div className="header">
                            <div>Compiler Data</div>
                            <div className="spacer" />
                            <button style={{ visibility: "hidden" }} >i</button>
                        </div>
                        <div className="ta ta2">
                            <div>
                                <Inspector data={data} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
