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

app.get('/', function(req, res) {
   res.sendFile(__dirname + '/index.html');
});

http.listen(port, function() {
    console.log('Server ready and listening on port: ' + port);
});

var express = require('express');
var mongodb = require('mongodb');
var app = express();

var MONGODB_URI = 'mongodb://VisualDemo:Visual2016@ds127948.mlab.com:27948/pruebavisual';
var db;
var coll;

// Initialize connection once
mongodb.MongoClient.connect(MONGODB_URI, function(err, database) {

  if(err) throw err;
  db = database;
  coll = db.collection('tickets_v2');
  console.log(coll);
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
        getDays(socket.id);
    });
    socket.on(glbs.INITIALIZE_STACKED, function(msg) {
        console.log(':! This is a ' + glbs.INITIALIZE + ' request... INICIAST')
        getData(socket.id, 'tickets', msg);
    });
    socket.on(glbs.INITIALIZE_STATES_VIOLIN, function(msg) {
        console.log(':! This is a ' + glbs.INITIALIZE_STATES_VIOLIN + ' request...AVERAGE_STATE' )
        // getStateAverageTable(socket.id);
    });

    socket.on(glbs.GET_ESTADOS, function(msg) {
        console.log(':! This is a ' + glbs.GET_ESTADOS + ' request... ESTADOS')
        getEstados(socket.id, 'tickets', msg);
    });

    socket.on(glbs.GET_TICKETS, function(msg) {
        console.log(':! This is a ' + glbs.GET_TICKETS + ' request... TIQUETES')
        // getTickets(socket.id, 'tickets', msg);
    });

    socket.on(glbs.GET_STATE_AVG, function(msg) {
        console.log(':! This is a ' + glbs.GET_STATE_AVG + ' request...AVERAGE ESTADOS')
        // getStateAverage(socket.id);
    });
});

// ------------------------------------------------------
// Functions
// ------------------------------------------------------

function getDays(socketId) {

}
function getData(socketId, table, msg) {
  coll.find({}, function(err, docs) {
    clients[socketId].emit(glbs.SHOW_DATA, docs.map(function (d) {return d.id;}));
  });
}

/* Funciones JavaScript

si se quiere hacer un where de sql ejemplo where ticket_id = 44527 aca es ticket_id:44527
 si se quieren las columnas (atributos) se especifican asi current_state:1 , si no se quiere se pone current_state:0
 El primer {} se usa para hacer filtro y el segundo {} se utiliza para especifiar que columnas se quieren o cuales no. 
 
 Ejemplos
 1.
 En caso de no hacer un filtro (WHERE) pero especificar columnas es asi:
 coll.find({},{ticket_id:1,current_state:1}) el anterior ejemplo da la columna ticket_id y current_state sin hacer ningun filtro
 2.
 En caso de hacer un filtro y especificar que columnas es asi:
 coll.find({ticket_id:77527,current_state:"CREADO"},{ticket_id:1,current_state:1})
 3.
 En caso se no hacer filtro y no especificar que columnas es asi:
 coll.find({ticket_id:77527,current_state:"CREADO"})

 
 
*/


function getEstados(socketId, table, msg) {

  coll.find({},{"current_state":1,"_id":0}, function(err, docs) {
    docs.each(function(err, doc) {
      if(doc) {
        clients[socketId].emit(glbs.SHOW_DATA, doc);
        console.log(doc);
      }
    });
  });
}
