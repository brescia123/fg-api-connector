// Create Expressjs app
var express = require('express');
var app = express();

// Requires
var Firebase = require('firebase');
var request = require('request');
var config = require('config');
var utils = require('./modules/utils.js');
var Kimono = require('./modules/kimono.js');
kimono = new Kimono(request, config, utils);

// Config
var urls = config.get('urls');

// Setup Firebase
var fgApi = new Firebase(config.get('urls').firebase_base);

// Setup endpoints
require('./modules/endpoints.js')(app, kimono, fgApi, config, utils);

// Setup port
app.set('port', (process.env.PORT || 5000));

// Start server
var server = app.listen(app.get('port'), '0.0.0.0', function() {

	var host = server.address().address;
	var port = server.address().port;

	console.log('Connector listening at http://%s:%s', host, port);

});
