'use strict';

// Module Configuration 
var express = require('express');
var app = express();
var swig = require('swig');
var index = require('./routes/index.js');
var items = require('./routes/items.js');

// Set up view engine
app.engine('html', swig.renderFile);

app.set('view engine', 'html');
app.set('views', __dirname + '/views');

// Set the public static resource folder
app.use(express.static(__dirname + '/../client/'));

// Set up port
var port = process.env.PORT || 1337;

// Set up routes
app.use('/api', items);
app.use('/', index);

// Start the server
app.listen(port);

// Shout out to the user
console.log(`Magic is happening on port ${port}`);