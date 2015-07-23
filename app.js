
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

// the ExpressJS App
var app = express();

// configuration of expressjs settings for the web server.

// server port number
app.set('port', process.env.PORT || 5000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride());

/**
 * CORS support for AJAX requests
 */

app.all('*', function(req, res, next){
  if (!req.get('Origin')) return next();
  // use "*" here to accept any origin
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'PUT');
  res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
  // res.set('Access-Control-Allow-Max-Age', 3600);
  if ('OPTIONS' == req.method) return res.send(200);
  next();
});

// api baseURI is at /api/

// API Routes
// ROUTES, logic is in routes/index.js

var routes = require('./routes/index.js');

// home route is not really an API route, but does respond back
app.get('/', routes.index); // calls index function in /routes/index.js

// API routes
app.get('/api/haltebus', routes.haltebus);
app.get('/api/kepolisian', routes.kepolisian);
app.get('/api/rumahsakit', routes.rumahSakit);
app.get('/api/sekolah', routes.sekolah);
app.get('/api/lokasitransportasi', routes.lokasiTransportasi);
app.get('/api/tempatibadah', routes.tempatIbadah);

// Utility
app.get('/api/clearData', routes.clearData);

// if route not found, respond with 404
app.use(function(req, res, next){

	var jsonData = {
		status: 'ERROR',
		message: 'Sorry, we cannot find the requested URI'
	};
	// set status as 404 and respond with data
  res.status(404).send(jsonData);

});

// create NodeJS HTTP server using 'app'
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
