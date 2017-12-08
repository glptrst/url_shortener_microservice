"use strict";
const http = require('http');
const fs = require('fs');
const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    //Add error listener
    req.on('error', (err) => {
	console.error(err);
	res.statusCode = 400;
	res.end();
    });
    
    if (req.method === 'GET') {
	if (req.url === '/') {
	    res.statusCode = 200;
	    fs.readFile("./public/index.html", (err, fileContent) => {
		res.end(fileContent);
	    });
	} else {
	    // check if it's a 
	}
    } else {
	res.statusCode = 404;
	res.end(`Cannot ${req.method} ${req.url}`);
    }

});

server.listen(port, () => {
    console.log(`Server running at port ${port}`);
});
