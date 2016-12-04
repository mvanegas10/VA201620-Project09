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

var config = {
  user: 'Meili', //env var: PGUSER
  database: 'va201620', //env var: PGDATABASE
  password: '', //env var: PGPASSWORD
  host: 'localhost', // Server hosting the postgres database
  port: 5432, //env var: PGPORT
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};

var pool = new pg.Pool(config);
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

    socket.on(glbs.INITIALIZE_DAYS, function(msg) {        
        console.log(':! This is a ' + glbs.INITIALIZE + ' request...')
        getDays(socket.id);
    });

    socket.on(glbs.INITIALIZE_STACKED, function(msg) {        
        console.log(':! This is a ' + glbs.INITIALIZE + ' request...')
        getData(socket.id, 'tickets', msg);
    });

    socket.on(glbs.GET_ESTADOS, function(msg) {
        console.log(':! This is a ' + glbs.GET_ESTADOS + ' request...')
        getEstados(socket.id, 'tickets', msg);
    });

    socket.on(glbs.GET_TICKETS, function(msg) {
        console.log(':! This is a ' + glbs.GET_TICKETS + ' request...')
        getTickets(socket.id, 'tickets', msg);
    });

    socket.on(glbs.GET_AVG, function(msg) {
        console.log(':! This is a ' + glbs.GET_AVG + ' request...')
        getAverage(socket.id, msg);
    });
});

// ------------------------------------------------------
// Functions
// ------------------------------------------------------

function getDays(socketId) {
  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('Error fetching client from pool', err);
    }
    var query = "SELECT DATE(time_finish_current) as day, AVG(duration) as duration, EXTRACT(dow from time_finish_current) as weekday FROM tickets GROUP BY day, weekday ORDER BY day;";
    client.query(query, function(err, result) {
      done();

      if(err) {
        return console.error('Error running query ' + query, err);
      }
      else clients[socketId].emit(glbs.SHOW_DAYS, result.rows);
    });
  });
}

function getData(socketId, table, msg) {
  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('Error fetching client from pool', err);
    }
    var query = "SELECT * FROM " + table + " WHERE " + msg;

    client.query(query, function(err, result) {
      done();
      console.log(query);

      if(err) {
        return console.error('Error running query ' + query, err);
      }
      else clients[socketId].emit(glbs.SHOW_DATA, result.rows);
    });
  });
}

function getEstados(socketId, table,msg) {
  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('Error fetching client from pool', err);
    }
    var query = "SELECT current_state FROM " + table + " WHERE " + msg + " GROUP BY current_state";
    client.query(query, function(err, result) {
      done();
      console.log(query);
      if(err) {
        return console.error('Error running query ' + query, err);
      }
      else clients[socketId].emit(glbs.SHOW_ESTADOS, result.rows);
    });
  });
}

function getTickets(socketId, table,msg) {
  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('Error fetching client from pool', err);
    }
    var query = "SELECT ticket_id FROM " + table + " WHERE " + msg + " GROUP BY ticket_id ";
    client.query(query, function(err, result) {
      done();
      console.log(query);

      if(err) {
        return console.error('Error running query ' + query, err);
      }
      else clients[socketId].emit(glbs.SHOW_TICKETS, result.rows);
    });
  });
}

function getStateAverage(socketId, msg) {
  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('Error fetching client from pool', err);
    }
    var query = "SELECT current_state, AVG(duration) FROM (SELECT current_state, duration, EXTRACT(dow FROM time_finish_current) AS weekday FROM tickets) query WHERE " + msg + " GROUP BY current_state;"
    client.query(query, function(err, result) {
      done();
      console.log(query);

      if(err) {
        return console.error('Error running query ' + query, err);
      }
      else clients[socketId].emit(glbs.SHOW_STATE_AVG, result.rows);
    });
  });    
}

function getAverage(socketId, msg) {
  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('Error fetching client from pool', err);
    }
    var query = "SELECT AVG(duration) FROM (SELECT duration, EXTRACT(dow FROM time_finish_current) AS weekday FROM tickets) query WHERE " + msg + ";";
    client.query(query, function(err, result) {
      done();
      console.log(query);

      if(err) {
        return console.error('Error running query ' + query, err);
      }
      else clients[socketId].emit(glbs.SHOW_AVG, result.rows);
    });
  });  
}