// server.js

'use strict';

// Module Configuration 
var express = require('express');
var app     = express();

// Set up view engine
app.set('view engine',"vash");
app.set('views', __dirname + '/app/views');

// Set the public static resource folder
app.use(express.static(__dirname + '/public'));

// Set up port
var port = process.env.PORT || 1337;

// Set up routes
require('./app/routes')(app);

// Start the server
app.listen(port);

// Shout out to the user
console.log(`Magic is happening on port ${port}`);