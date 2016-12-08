// ------------------------------------------------------
// Imports
// ------------------------------------------------------

var app = require('express')();
var http = require('http').Server(app);
var express = require('express');

var pg = require('pg');

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

//app.get('/', function(req, res) {
  //  res.sendFile(__dirname + '/index.html');
//});

http.listen(port, function() {
    console.log('Server ready and listening on port: ' + port);
});

var express = require('express');
var mongodb = require('mongodb');
var app = express();

var MONGODB_URI = 'mongodb://visualAnalytics:visual20162@ds129038.mlab.com:29038/visualsnalitycs';
var db;
var coll;

// Initialize connection once
mongodb.MongoClient.connect(MONGODB_URI, function(err, database) {

  if(err) throw err;
  db = database;
  coll = db.collection('tickets');

  app.listen(3000);

});

//----------------------------------------------------
// Event Management
// ------------------------------------------------------
io.on('connection', function(socket) {
    if (!clients[socket.id]) {
        console.log(':! This is a new connection request...  CLIENTE');
        clients[socket.id] = socket;
    }
    socket.on('disconnect', function() {
        console.log(':! This is a disconnection request... DESCO');
        delete clients[socket.id];
    });

    socket.on(glbs.INITIALIZE_DAYS, function(msg) {
        console.log(':! This is a ' + glbs.INITIALIZE + ' request...DIASINI' )
        console.log()
        getDays(socket.id);
    });
    socket.on(glbs.INITIALIZE_STACKED, function(msg) {
        console.log(':! This is a ' + glbs.INITIALIZE + ' request... INICIAST')
        getData(socket.id, 'tickets', msg);
    });
    socket.on(glbs.INITIALIZE_STATES_VIOLIN, function(msg) {
        console.log(':! This is a ' + glbs.INITIALIZE_STATES_VIOLIN + ' request...AVERAGE_STATE' )
        console.log()
        getStateAverageTable(socket.id);
    });

    socket.on(glbs.GET_ESTADOS, function(msg) {
        console.log(':! This is a ' + glbs.GET_ESTADOS + ' request... ESTADOS')
        getEstados(socket.id, 'tickets', msg);
    });

    socket.on(glbs.GET_TICKETS, function(msg) {
        console.log(':! This is a ' + glbs.GET_TICKETS + ' request... TIQUETES')
        getTickets(socket.id, 'tickets', msg);
    });

    socket.on(glbs.GET_STATE_AVG, function(msg) {
        console.log(':! This is a ' + glbs.GET_STATE_AVG + ' request...AVERAGE ESTADOS')
        getStateAverage(socket.id);
    });
});

// ------------------------------------------------------
// Functions
// ------------------------------------------------------

function getDays(socketId) {

}
function getData(socketId, table, msg) {
  coll.find({}, function(err, docs) {
    docs.each(function(err, doc) {
      if(doc) {
        clients[socketId].emit(glbs.SHOW_DATA, doc);
      }
      else {

      }
    });
  });
}

function getEstados(socketId, table, msg) {
  coll.find({"current_state":1,"_id":0}, function(err, docs) {
    docs.each(function(err, doc) {
      if(doc) {
        clients[socketId].emit(glbs.SHOW_DATA, doc);
        console.log(doc);
      }
      else {

      }
    });
  });
}
