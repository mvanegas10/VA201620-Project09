// ------------------------------------------------------
// Imports
// ------------------------------------------------------

var app = require('express')();
var http = require('http').Server(app);
var express = require('express');
var mysql = require('mysql');

var io = require('socket.io')(http);
var fs = require('fs');
var glbs = require('./public/js/globals.js');
var port = 8080;

// ------------------------------------------------------
// Variables
// ------------------------------------------------------

var clients = {};

// Web server initialization...
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

http.listen(port, function() {
    console.log('Server ready and listening on port: ' + port);
});

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '1234',
  database : 'va201620'
});
connection.connect();

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
        console.log(':! This is a ' + glbs.INITIALIZE + ' request...')
        getData(socket.id, 'tickets');
    });

    socket.on(glbs.GET_ESTADOS, function() {
        console.log(':! This is a ' + glbs.GET_ESTADOS + ' request...')
        getEstados(socket.id, 'tickets');
    });

    socket.on(glbs.GET_TICKETS, function() {
        console.log(':! This is a ' + glbs.GET_TICKETS + ' request...')
        getTickets(socket.id, 'tickets');
    });
});

// ------------------------------------------------------
// Functions
// ------------------------------------------------------

function getData(socketId, table) {
    var query = "SELECT * FROM " + table + " WHERE elapsed_time IS NOT NULL AND create_time BETWEEN '2012-07-31 00:00:00' AND '2012-09-04 00:00:00'";
    console.log(query);
    connection.query(query, function(err, rows, fields) {
        if (!err) {
            clients[socketId].emit(glbs.SHOW_DATA, rows);
        }
        else console.log('Error while performing Query.');
    });
}

function getEstados(socketId, table) {
    var query = "SELECT state_name FROM " + table + " WHERE elapsed_time IS NOT NULL AND create_time BETWEEN '2012-07-31 00:00:00' AND '2012-09-04 00:00:00' GROUP BY state_name";
    console.log(query);
    connection.query(query, function(err, rows, fields) {
        if (!err) {
            clients[socketId].emit(glbs.SHOW_ESTADOS, rows);
        }
        else console.log('Error while performing Query.');
    });
}

function getTickets(socketId, table) {
    var query = "SELECT ticket_id FROM " + table + " WHERE elapsed_time IS NOT NULL AND create_time BETWEEN '2012-07-31 00:00:00' AND '2012-09-04 00:00:00' GROUP BY ticket_id";
    console.log(query);
    connection.query(query, function(err, rows, fields) {
        if (!err) {
            clients[socketId].emit(glbs.SHOW_TICKETS, rows);
        }
        else console.log('Error while performing Query.');
    });
}