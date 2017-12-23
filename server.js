"use strict";
const http = require('http');
const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const dbName = 'url_shortener_microservice_db';
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
			// everything should be alright

			let shortUrl = createDoc();

			// create an object with the parameter and a short url for it
			let result = {
			    "orginal_url": parameter,
			    "short_url": shortUrl
			};
			console.log(result);
			
			// insert document in the database
			
			// serve a page showing the document
						
		    } else {
			res.statusCode = 404;
			res.end(`Wrong parameter`);
			console.log(`Wrong parameter`);
		    }
		} else {
		    res.statusCode = 404;
		    res.end(`Wrong parameter`);
		    console.log(`Wrong parameter`);
		}
	    } else {
		//check if it has been passed a short url that is present in the database

		// if it is the case, then redirect to the right page

		// otherwise end the response with a 404

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

// Create a new doc with a short url. Return the short url value created.
function createDoc() {
    // create a short url that is not already present in the database
    let shortUrl = 'https://lit-ravine-89856.herokuapp.com/' + (Math.floor(Math.random() * (999 - 0 + 1)) + 0);

    MongoClient.connect(process.env.DBURI, function(err, client) {
	assert.equal(null, err);
	console.log("Connected successfully to server");

	const db = client.db(dbName);

	db.collection('urls').find({'short_url': shortUrl}).toArray(function(err, docs) {
	    assert.equal(err, null);
	    
	    
	    if (docs[0] === undefined) { //if this is true there is no doc has been found with the short url generated
		// then we can insert the doc
		console.log('we are inserting a new doc (fake)');
		// TODO: insert new doc
		client.close();
	    } else {
		// try again with another random url
		console.log('The short url created already exists. Trying with another one');
		createDoc();
	    }
	});
    });

    return shortUrl;
}
