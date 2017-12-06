"use strict";
const http = require('http');
const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    //Add error listener
    req.on('error', (err) => {
	console.error(err);
	res.statusCode = 400;
	res.end();
    });
    
    if (req.method === 'GET') {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/plain');
	res.end('Hello world');
    } else {
	res.statusCode = 404;
	res.end(`Cannot ${req.method} ${req.url}`);
    }

});

server.listen(port, () => {
    console.log(`Server running at port ${port}`);
});
