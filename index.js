// ------------------------------------------------------
// Imports
// ------------------------------------------------------

var app = require('express')();
var http = require('http').Server(app);
var geo = require('geotabuladb'); // Database operation
var express = require('express');

var io = require('socket.io')(http);
var fs = require('fs');

var glbs = require('./public/js/globals.js');

var port = 8080;

// ------------------------------------------------------
// Variables
// ------------------------------------------------------

var clients = {};

geo.setCredentials({
    type: 'postgis',
    host: 'localhost',
    user: 'Meili',
    password: '',
    database: 'va201620'
});

// Web server initialization...
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

http.listen(port, function() {
    console.log('Server ready and listening on port: ' + port);
});

// ------------------------------------------------------
// Event Management
// ------------------------------------------------------

io.on('connection', function(socket) {
    console.log(': Socket connection from client ' + socket.id);

    if (!clients[socket.id]) { 
        console.log(':! This is a new connection request... ');
        clients[socket.id] = socket;
    }
    socket.on('disconnect', function() {
        console.log(':! This is a disconnection request...');
        delete clients[socket.id];
    });

    socket.on(glbs.INITIALIZE, function() {
        getData(socket.id, table);
    });
});

// ------------------------------------------------------
// Functions
// ------------------------------------------------------

function getData(socketId, table) {
    var query = 'SELECT * FROM ' + table;
    var parameters = {
        querystring: query,
    };

    geo.query(parameters, function(json) {
        clients[socketId].emit(glbs.SHOW_DATA, json);
    });

}