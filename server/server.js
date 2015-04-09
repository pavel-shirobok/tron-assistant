var express = require('express');
var https = require('https');
var http = require('http');
var fs = require('fs');
var request = require('request');

// This line is from the Node.js HTTPS documentation.
var options = {
    key: fs.readFileSync('key/key.pem'),
    cert: fs.readFileSync('key/cert.pem')
};

// Create a service (the app object is just a callback).
var app = express();
app.use(express.static('../src/'));

app.get('/weather', function(req, res){
    req.pipe(request('http://api.openweathermap.org/data/2.5/find?q=Krasnoyarsk,ru&units=metric')).pipe(res);
});

app.get('/fun/:id', function(req, res){
    req.pipe(request('http://rzhunemogu.ru/RandJSON.aspx?CType=' + req.param("id"))).pipe(res);
});

// Create an HTTP service.
http.createServer(app).listen(1234);
// Create an HTTPS service identical to the HTTP service.
https.createServer(options, app).listen(444);