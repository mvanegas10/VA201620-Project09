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



var mysql = require('mysql');
var pool  = mysql.createPool({
  connectionLimit : 10,
  host            : 'localhost',
  user            : 'root',
  password        : 'Mayo301995',
  database        : 'visual',
  port:3306
});
// ------------------------------------------------------
// Event Management
// ------------------------------------------------------

io.on('connection', function(socket) {
    console.log(': Socket connection from client ' + socket.id);

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

    socket.on(glbs.GET_ESTADOS, function(msg) {
        console.log(':! This is a ' + glbs.GET_ESTADOS + ' request... ESTADOS')
        getEstados(socket.id, 'tickets', msg);
    });

    socket.on(glbs.GET_TICKETS, function(msg) {
        console.log(':! This is a ' + glbs.GET_TICKETS + ' request... TIQUETES')
        getTickets(socket.id, 'tickets', msg);
    });

    socket.on(glbs.GET_AVG, function(msg) {
        console.log(':! This is a ' + glbs.GET_AVG + ' request... AVERAGE')
        getAverage(socket.id, msg);
    });

    socket.on(glbs.GET_STATE_AVG, function(msg) {
        console.log(':! This is a ' + glbs.GET_STATE_AVG + ' request...AVERAGE ESTADOS')
        getStateAverage(socket.id, msg);
    });
});

// ------------------------------------------------------
// Functions
// ------------------------------------------------------

function getDays(socketId) {
  pool.getConnection(function(err, connection) {
    if(err) {
      return console.error('Error fetching client from pool', err);
    }
    var query = "SELECT DATE(time_finish_current) as day, AVG(duration) as duration, DAYOFWEEK(time_finish_current)-1 as weekday FROM tickets GROUP BY day, weekday ORDER BY day;";
    connection.query(query, function(err, rows) {
      connection.release();
      console.log(query);

      if(err) {
        return console.error('Error running query ' + query, err);
      }
      else
        clients[socketId].emit(glbs.SHOW_DAYS, rows);

    });
  });
}
function getData(socketId, table, msg) {
  pool.getConnection(function(err, connection) {
    if(err) {
      return console.error('Error fetching client from pool', err);
    }
    console.log(msg)
    var query = "SELECT * FROM " + table
    connection.query(query, function(err, rows) {
    connection.release();
      console.log(query);

      if(err) {
        return console.error('Error running query ' + query, err);
      }
      else clients[socketId].emit(glbs.SHOW_DATA, rows);
    });
  });
}
function getEstados(socketId, table,msg) {
  pool.getConnection(function(err, connection) {
    if(err) {
      return console.error('Error fetching client from pool', err);
    }
    if(msg==null)
      var query = "SELECT current_state FROM " + table + " GROUP BY current_state";
    else
      var query = "SELECT current_state FROM " + table + " WHERE " + msg + " GROUP BY current_state";
    connection.query(query, function(err, rows) {
      connection.release();
      console.log(query);
      if(err) {
        return console.error('Error running query ' + query, err);
      }
      else clients[socketId].emit(glbs.SHOW_ESTADOS, rows);
    });
  });
}

function getTickets(socketId, table,msg) {
  pool.getConnection(function(err, connection) {
    if(err) {
      return console.error('Error fetching client from pool', err);
    }
    if(msg==null)
      var query = "SELECT ticket_id FROM " + table + " GROUP BY ticket_id ";
    else {
      var query = "SELECT ticket_id FROM " + table + " WHERE "+msg+" GROUP BY ticket_id ";
    }
    connection.query(query, function(err, rows) {
      connection.release();
      console.log(query);

      if(err) {
        return console.error('Error running query ' + query, err);
      }
      else clients[socketId].emit(glbs.SHOW_TICKETS, rows);
    });
  });
}
function getStateAverage(socketId, table,msg) {
  pool.getConnection(function(err, connection) {
    if(err) {
      return console.error('Error fetching client from pool', err);
    }
    if(msg==null)
    var query = "SELECT current_state as state, AVG(duration) as duration FROM (SELECT current_state, duration, DAYOFWEEK(time_finish_current)-1 AS weekday FROM tickets) query;  " ;
    else {
      var query = "SELECT current_state as state, AVG(duration) as duration FROM (SELECT current_state, duration, DAYOFWEEK(time_finish_current)-1 AS weekday FROM tickets) query WHERE " + msg + " GROUP BY current_state;";
    }
    connection.query(query, function(err, rows) {
      connection.release();
      console.log(query);

      if(err) {
        return console.error('Error running query ' + query, err);
      }
      else clients[socketId].emit(glbs.SHOW_AVG, rows);
    });
  });
}
function getAverage(socketId, table,msg) {
  pool.getConnection(function(err, connection) {
    if(err) {
      return console.error('Error fetching client from pool', err);
    }
    if(msg==null){
      //window.alert(msg);
    var query = "SELECT AVG(duration) FROM (SELECT duration, DAYOFWEEK(time_finish_current)-1 AS weekday FROM tickets) query ; " ;
    }
    else {
      window.alert(msg);
      var query = "SELECT AVG(duration) FROM (SELECT duration, DAYOFWEEK(time_finish_current)-1 AS weekday FROM tickets) query WHERE " + msg + ";";
    }
    connection.query(query, function(err, rows) {
      connection.release();
      console.log(query+ "NO RRR");

      if(err) {
        return console.error('Error running query ' + query, err);
      }
      else clients[socketId].emit(glbs.SHOW_STATE_AVG, rows);
    });
  });
}
