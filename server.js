"use strict";
const http = require('http');
const fs = require('fs');
const mongodb = require('mongodb');
const assert = require('assert');
const dbName = 'url_shortener_microservice_db';
const port = process.env.PORT || 3000;

mongodb.MongoClient.connect(process.env.DBURI, function(err, db) {
    const collection = db.collection('urls');
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
		if (splittedUrl[1] === 'new') { // the condition is true then the user is trying to create a new short url
		    // get url passed (parameter)
		    let parameter = req.url.slice(req.url.indexOf('new/')+4, req.url.length);
		    console.log(`requesting new short link for: ${parameter}`);
		    // Check whether parameter follows the valid http://www.example.com format
		    // The first eleven/twelve chars should be : "http://www." or "https://www."
		    if (parameter.slice(0, 12) === 'https://www.' || parameter.slice(0, 11) === 'http://www.') {
			let secondPartParameter = parameter[4] === 's' ? parameter.slice(12, parameter.length) : parameter.slice(11, parameter.lenght);
			// Check second part of parameter
			// There should be at least one '.'
			if (secondPartParameter.split('.').length >= 2) {
			    // The conditions have been passed. Then it should be all right.
			    console.log({"original_url": parameter});
			    // check whether the parameter-url passed is already present in the database
			    collection.find({"original_url": parameter}).toArray(function (err, docs) {
				if (err){
				    console.log(err);
				} else {
				    if (docs[0] === undefined) {
					console.log('No doc for the link passed has been found. We can create a short url.');
					//get number of docs in the collection
					collection.find({}).count(function(err, numberOfDocs){
					    // Limit database collection to a maximum of 1000 documents
					    if (numberOfDocs < 999) {
						console.log('There is enough space in the db. We can create the doc.');
						var doc = {
						    "original_url": parameter,
						    "short_url": 'https://lit-ravine-89856.herokuapp.com/' + String(numberOfDocs + 1 )
						};
						collection.insertOne(doc, function (err, result) {
						    if (err) {
							console.log(err);
						    }else {
							console.log('New Doc inserted!');
							// Serve relevant information 
							res.statusCode = 200;
							res.setHeader('Content-Type', 'application/json');
							res.end(JSON.stringify({"original_url": doc["original_url"], "short_url": doc["short_url"]}));
						    }
						});
					    } else {
						console.log("Database full! Number of docs: " + String(numberOfDocs));
					    }
					});
					
				    } else {
				    	console.log('There is already a doc for the link passed:');
					console.log(docs);
					// Just serve that relevant info
					// TODO
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify({"original_url": docs[0]["original_url"], "short_url": docs[0]["short_url"]}));
				    }
				}
			    });
			    
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

});
