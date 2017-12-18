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
	    let splittedUrl = req.url.split('/');
	    if (splittedUrl[1] === 'new') {
		let parameter = req.url.slice(req.url.indexOf('new/')+4, req.url.length);
		console.log(`requesting new short link for: ${parameter}`);
		// Check whether parameter follows the valid http://www.example.com format
		// The first eleven/twelve chars should be : "http://www." or "https://www"
		if (parameter.slice(0, 12) === 'https://www.' || parameter.slice(0, 11) === 'http://www.') {
		    let secondPartParameter = parameter[4] === 's' ? parameter.slice(12,parameter.length) : parameter.slice(11, parameter.lenght);
		    // Check second part of parameter
		    // There should be at laest one '.'
		    if (secondPartParameter.split('.').length >= 2) {
			
		    } else {
			res.statusCode = 404;
			res.end(`Wrong parameter`);
		    }
		} else {
		    res.statusCode = 404;
		    res.end(`Wrong parameter`);
		}
	    } else {
		res.statusCode = 404;
		res.end(`Cannot ${req.method} ${req.url}`);
	    }
	}
    } else {
	res.statusCode = 404;
	res.end(`Cannot ${req.method} ${req.url}`);
    }
});

server.listen(port, () => {
    console.log(`Server running at port ${port}`);
});
