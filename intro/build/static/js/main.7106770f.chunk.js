(this.webpackJsonpintro=this.webpackJsonpintro||[]).push([[0],{15:function(e,n,s){},16:function(e,n,s){},25:function(e,n,s){"use strict";s.r(n);var t=s(0),a=s.n(t),i=s(7),c=s.n(i),l=(s(15),s(3)),r=(s.p,s(16),s(8)),d=s(10),o=s.n(d),j=s(5),u=(s(21),s(22),s(23),s(1)),h='require "pry-byebug"\n\nbinding.pry\n\nputs("Hello World!")\nputs "Hello this way as well"\n\nx = 3\ny = 4\nz = 5\nanswer = x*y + z\nputs("The Answer is:")\nputs(answer)\n\ngreeting = "Hello, "\nperson1 = "Joe"\nperson2 = "Bob"\n\nfullMessage1 = greeting + person1\nputs(fullMessage1)\n\nfullMessage2 = greeting + person2\nputs(fullMessage2)\n\ndef sayHello(person)\n  intro = "Hello, "\n  fullMessage = intro + person\n  puts(fullMessage)\nend\n\nperson3 = "Alice"\nsayHello(person3)\nsayHello("Carol")\n\ndef introduce(greeter, greeted)\n  message = "Hello, " + greeted + ", I am " + greeter\n  if (greeter == greeted)\n    message = "Hello, " + greeted + ", we have the same name"\n  end\n  puts(message)\nend\n\nintroduce(person1, person3)\nintroduce(person2, "Bob")\n\ndef addExcitement(message, level)\n  if (level == 0)\n    message = message + "..."\n  end\n  i = 0\n  while (i < level)\n    message = message + "!"\n    i = i + 1\n  end\n  message\nend\n\nputs(addExcitement("I like turtles", 0))\nputs(addExcitement("I like turtles", 2))\nputs(addExcitement("I like turtles", 4))\n\ndef sayGoodbye(person)\n  intro = "Goodbye, "\n  goodbye = addExcitement(intro + person, 3)\n  postscript = " I hope to see you soon"\n  fullMessage = goodbye + postscript\n  puts(fullMessage)\nend\n\nsayGoodbye(person1)\nsayGoodbye(person2)\nsayGoodbye(person3)\n\n### data types\n\n# array\n\na1 = [1, 2, 3]\na2 = [4, 5, 6]\nv1 = a1.first\nv2 = a2[2]\na3 = a2.take(2).push(v1).push(v2)\nputs("Start array print:")\nputs(a3)\nputs("End array print")\n\n# hash\n\nh1 = {\n  "Chicago" => "Illinois",\n  "San Francisco" => "California",\n  "Seattle" => "Washington",\n}\nc1 = h1["Chicago"]\nhasCity1 = h1.include?("Seattle")\nhasCity2 = h1.include?("Los Angeles")\ncities = h1.keys\nh1.delete("San Francisco")\nputs(h1)\n'.split("\n").slice(4).join("\n"),b=h.split("\n"),p=window.serverData,m=!1;var x=function(){var e=a.a.useState(!p.stopped),n=Object(l.a)(e,2),s=n[0],t=n[1],i=a.a.useState(s),c=Object(l.a)(i,2),d=c[0],x=c[1],v=a.a.useState(p.vars||{}),f=Object(l.a)(v,2),O=f[0],g=f[1],y=a.a.useState(p.stack||[{linenum:0,fname:""}]),N=Object(l.a)(y,2),S=N[0],k=N[1],w=a.a.useState(""),C=Object(l.a)(w,2),F=C[0],M=C[1],H=S.map((function(e){for(var n=e.linenum+1;n<100&&(b[n-1]||"").length<1;)n++;return{linenum:n,fname:e.fname}})),E=H[0].linenum,I=F;return Object(u.jsx)("div",{className:"page",children:Object(u.jsxs)("div",{style:{display:"flex",flexDirection:"row"},children:[Object(u.jsx)("div",{style:{flex:"2"},children:Object(u.jsxs)("div",{className:"editor",children:[Object(u.jsxs)("div",{className:"header",children:[Object(u.jsx)("div",{children:"Editor"}),Object(u.jsx)("div",{className:"spacer"}),Object(u.jsx)("div",{className:"spacer"}),Object(u.jsx)("div",{className:"spacer"}),Object(u.jsx)("div",{className:"spacer"}),Object(u.jsx)("div",{className:"spacer"}),Object(u.jsx)("div",{className:"spacer"}),Object(u.jsx)("a",{onClick:function(e){e.preventDefault(),s&&fetch("/reset").then((function(){t(!1),x(!1),g({}),k([{linenum:0,fname:""}]),M("")}))},href:s?"":null,children:"Reset"}),Object(u.jsx)("div",{className:"spacer"}),Object(u.jsx)("a",{onClick:function(e){e.preventDefault(),s&&(m||(m=!0,t(!0),fetch("/rewind").then((function(e){return e.json()})).then((function(e){var n=e.stack,s=e.vars,a=e.stdin,i=e.done;M(a||""),x(!0),i||(g(s),k(n)),i&&(k([{linenum:0,fname:""}]),t(!1),x(!1)),m=!1}))))},href:s?"":null,children:"Rewind"}),Object(u.jsx)("div",{className:"spacer"}),Object(u.jsx)("a",{onClick:function(e){e.preventDefault(),m||(m=!0,s||(M(""),g({}),t(!0)),fetch(s?"/step":"/start").then((function(e){return e.json()})).then((function(e){var n=e.stack,a=e.vars,i=e.stdin,c=e.done;M((s?F:"")+(i||"")),x(!0),c||(g(a),k(n)),c&&(k([{linenum:0,fname:""}]),t(!1),x(!1)),m=!1})))},href:"",children:"Step"}),Object(u.jsx)("div",{className:"spacer"})]}),Object(u.jsx)("div",{className:"ta",children:Object(u.jsx)("div",{children:Object(u.jsx)(o.a,{onValueChange:function(e){},highlight:function(e){return Object(j.highlight)(e,j.languages.ruby).split("\n").map((function(e,n){return'<span class="container_editor_line_number '.concat(n+1===E?"hlight":"",'">').concat(e,"</span>")})).join("\n")},value:h,padding:10,style:{fontFamily:'"Fira code", "Fira Mono", monospace',fontSize:12}})})})]})}),Object(u.jsxs)("div",{style:{flex:"1",display:"flex",flexDirection:"column"},children:[Object(u.jsxs)("div",{className:"editor",children:[Object(u.jsxs)("div",{className:"header",children:[Object(u.jsx)("div",{children:"Variables"}),Object(u.jsx)("div",{className:"spacer"}),Object(u.jsx)("button",{style:{visibility:"hidden"},children:"i"})]}),Object(u.jsx)("div",{className:"ta ta2",children:Object(u.jsx)("div",{children:Object(u.jsx)(r.a,{data:O})})})]}),Object(u.jsxs)("div",{className:"editor",children:[Object(u.jsxs)("div",{className:"header",children:[Object(u.jsx)("div",{children:"Stack"}),Object(u.jsx)("div",{className:"spacer"}),Object(u.jsx)("button",{style:{visibility:"hidden"},children:"i"})]}),Object(u.jsx)("div",{className:"ta ta2",children:d?Object(u.jsxs)("table",{style:{margin:"auto"},className:"table",children:[Object(u.jsxs)("tr",{children:[Object(u.jsx)("th",{children:"Function"}),Object(u.jsx)("th",{children:"Line Number"})]}),H.reverse().map((function(e){var n=e.fname,s=e.linenum;return Object(u.jsxs)("tr",{children:[Object(u.jsx)("td",{children:""===n?Object(u.jsx)("italic",{children:"toplevel"}):n}),Object(u.jsx)("td",{children:s})]})}))]}):Object(u.jsx)("div",{})})]}),Object(u.jsxs)("div",{className:"editor",children:[Object(u.jsxs)("div",{className:"header",children:[Object(u.jsx)("div",{children:"Output"}),Object(u.jsx)("div",{className:"spacer"}),Object(u.jsx)("button",{style:{visibility:"hidden"},children:"i"})]}),Object(u.jsx)("div",{className:"ta ta2",children:Object(u.jsx)("pre",{style:{marginLeft:"1rem"},children:I})})]})]})]})})},v=function(e){e&&e instanceof Function&&s.e(3).then(s.bind(null,26)).then((function(n){var s=n.getCLS,t=n.getFID,a=n.getFCP,i=n.getLCP,c=n.getTTFB;s(e),t(e),a(e),i(e),c(e)}))};c.a.render(Object(u.jsx)(a.a.StrictMode,{children:Object(u.jsx)(x,{})}),document.getElementById("root")),v()}},[[25,1,2]]]);
//# sourceMappingURL=main.7106770f.chunk.js.map