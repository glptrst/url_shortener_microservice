const express = require('express');
const mongodb = require('mongodb');
const path = require('path');

const app = express();

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname+'/public/index.html'));
});
app.get('/:parameter', function(req, res){
    // avoid favicon request: https://stackoverflow.com/questions/17952436/node-js-double-console-log-output
    if(req.url === '/favicon.ico')
    {
	console.log('favicon requested');
    } else {

	res.json(
	    {
		"ipaddress": null,
		"language": null,
		"sofware": null
	    }
	);
    }
});

app.listen(process.env.PORT || 3000);
