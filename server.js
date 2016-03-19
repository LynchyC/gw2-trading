// server.js

'use strict';

// Module Configuration 
var express = require('express');
var app     = express();

// Set up port
var port = process.env.PORT || 1337;

// Set up routes
require('./app/routes')(app);

// Start the server
app.listen(port);

// Shout out to the user
console.log(`Magic is happening on port ${port}`);     