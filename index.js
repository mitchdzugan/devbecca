const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const { spawn } = require("child_process");

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/start', (req, res) => {
	const proc = spawn("ruby", ["./basics.rb"]);
	proc.stdout.on("data", data => {
		console.log({ data });
	});
  res.send('Hello World!!!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

