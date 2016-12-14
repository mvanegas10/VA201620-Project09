// ------------------------------------------------------
// Imports
// ------------------------------------------------------

var app = require('express')();
var http = require('http').Server(app);
var express = require('express');

var pg = require('pg');
pg.defaults.ssl = true;

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

http.listen(port, function() { // Setting ip the server port...
    console.log('Server ready and listening on port: ' + port);
});

var connectionString = "postgres://kxgjsphddjlktv:820455c3978dece3abad005c28935a34adb663478088950e804ebe1646b4a889@ec2-23-21-224-106.compute-1.amazonaws.com:5432/d4qeomd9ibd5u7";
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
        console.log(':! This is a ' + glbs.INITIALIZE_DAYS + ' request...')
        getDays(socket.id);
    });

    socket.on(glbs.INITIALIZE_STACKED, function(msg) {
        console.log(':! This is a ' + glbs.INITIALIZE_STACKED + ' request...')
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

    socket.on(glbs.GET_STATE_AVG, function(msg) {
        console.log(':! This is a ' + glbs.GET_STATE_AVG + ' request...')
        getStateAverage(socket.id, msg);
    });

    socket.on(glbs.INITIALIZE_STATES_VIOLIN, function(msg) {
        console.log(':! This is a ' + glbs.INITIALIZE_STATES_VIOLIN + ' request...' )
        getStateAverageTable(socket.id);
    });    
});

// ------------------------------------------------------
// Functions
// ------------------------------------------------------

function getDays(socketId) {
  pg.connect(connectionString, function(err, client) {
    if (err) throw err;
    var done = client
      .query('SELECT date as day, AVG(duration) as duration, EXTRACT(dow from date) as weekday FROM tickets GROUP BY weekday,day ORDER BY day;');      

    done.on("end", function (result) {          
      client.end();
      clients[socketId].emit(glbs.SHOW_DAYS, result.rows);
    });    
  });
}

function getData(socketId, table, msg) {
  pg.connect(connectionString, function(err, client) {
    if (err) throw err;
    var query;
    if (msg == null || msg === undefined || msg == "") query = "SELECT * FROM " + table;
    else query = "SELECT * FROM " + table + " WHERE " + msg;
    var done = client
      .query(query);
    console.log(query);      
    
    done.on("end", function (result) {          
      client.end();
      clients[socketId].emit(glbs.SHOW_DATA, result.rows);
    }); 

  });
}

function getEstados(socketId, table,msg) {
  pg.connect(connectionString, function(err, client) {
    if (err) throw err;
    var query;
    if (msg == null || msg === undefined || msg == "") query = "SELECT current_state FROM " + table + " GROUP BY current_state";
    else query = "SELECT current_state FROM " + table + " WHERE " + msg + " GROUP BY current_state";
    var done = client
      .query(query);
    
    done.on("end", function (result) {          
      client.end();
      clients[socketId].emit(glbs.SHOW_ESTADOS, result.rows);
    });       
  });
}

function getTickets(socketId, table,msg) {
  pg.connect(connectionString, function(err, client) {
    if (err) throw err;
    var query;
    if (msg == null || msg === undefined || msg == "") query = "SELECT ticket_id FROM " + table + " GROUP BY ticket_id ";
    else query = "SELECT ticket_id FROM " + table + " WHERE " + msg + "  GROUP BY ticket_id ";
    var done = client
      .query(query);

    done.on("end", function (result) {          
      client.end();
      clients[socketId].emit(glbs.SHOW_TICKETS, result.rows);
    });     

  });
}

function getStateAverage(socketId, msg) {
  pg.connect(connectionString, function(err, client) {
    if (err) throw err;
    var query = "SELECT current_state, max(EXTRACT(EPOCH FROM time_finish_current-time_begin_current)/216000)as MaxTime,min(EXTRACT(EPOCH FROM time_finish_current-time_begin_current)/216000)as MinTime,avg(EXTRACT(EPOCH FROM time_finish_current-time_begin_current)/216000)as avgTime FROM tickets group by current_state;" ;
    var done = client
      .query(query);
    
    done.on("end", function (result) {          
      client.end();
      clients[socketId].emit(glbs.SHOW_STATE_AVG, result.rows);
    }); 

  });
}

function getAverage(socketId, msg) {
  pg.connect(connectionString, function(err, client) {
    if (err) throw err;
    var query;
    if (msg == undefined || msg == null || msg == "") query = "SELECT AVG(duration) as avg FROM tickets";
    else query = "SELECT AVG(duration) as avg FROM tickets WHERE " + msg;
    var done = client
      .query(query);

    done.on("end", function (result) {          
      client.end();
      clients[socketId].emit(glbs.SHOW_AVG, result.rows);
    });     
  });
}

function getStateAverageTable(socketId) {
  pg.connect(connectionString, function(err, client) {
    if (err) throw err;
    var query = "SELECT ticket_id,current_state,time_begin_current,ticket_typo, EXTRACT(EPOCH FROM time_finish_current-time_begin_current)/216000 as timeState FROM tickets;" ;
    var done = client
      .query(query);

    done.on("end", function (result) {          
      client.end();
      clients[socketId].emit(glbs.INITIALIZE_DAYS_VIOLIN, result.rows);
    });     
  });
}
