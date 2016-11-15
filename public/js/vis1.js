// ------------------------------------------------------
// VARIABLES
// ------------------------------------------------------

var socket = io();
var dataIncidentes = [];
var dataTickets = {};
var dataEstados = [];
var timeTickets = [];
var chart;
var chart1;

// ------------------------------------------------------
// MANAGE CONNECTION WITH BACKEND
// ------------------------------------------------------

var msg = {"initialState":'2016-06-13', "finalState":'2016-06-14'}
socket.emit(INITIALIZE,msg);

socket.on(SHOW_DATA, function (data) {
    console.log(":! This is a " + INITIALIZE + " request...");
    dataIncidentes = data;
    socket.emit(GET_ESTADOS,msg);
});

socket.on(SHOW_ESTADOS, function (data) {
    console.log(":! This is a " + SHOW_ESTADOS + " request...");
    dataEstados = data.map(function (d) {return d.current_state});
    socket.emit(GET_TICKETS,msg);
})

socket.on(SHOW_TICKETS, function (data) {
    console.log(":! This is a " + SHOW_TICKETS + " request...");
    dataTickets = data.map(function (d) {return d.ticket_id});

    console.log(dataIncidentes);
    console.log(dataEstados);
    console.log(dataTickets);

    dataIncidentes.forEach(function (d) {
        if (timeTickets[d.current_state] === undefined) {
            timeTickets[d.current_state] = {};
        }
        timeTickets[d.current_state][d.ticket_id] = d.duration;
    })

    var dataFinal = [];

    dataEstados.forEach(function (d) {
        var nums = [];
        nums.push(d);
        dataTickets.forEach(function (s) {
            if (timeTickets[d][s] === undefined) timeTickets[d][s] = 0.0;
            else timeTickets[d][s] = +timeTickets[d][s];
            nums.push(timeTickets[d][s]);
        })
        dataFinal.push(nums);
    })

    stackedBarChart(dataFinal);
       
});

// ------------------------------------------------------
// DRAW CHART 1
// ------------------------------------------------------
function lineChart(columnsData) {
    chart = c3.generate({
        size: {
            height: 300,
            width: 1225
        },
        bindto: '#lineChart',
        data: {
            x: 'x',
            columns: [
                ['x', '2013-01-01', '2013-01-02', '2013-01-03', '2013-01-04', '2013-01-05', '2013-01-06'],
                ['data1', 30, 200, 100, 400, 150, 250],
                ['data2', 130, 340, 200, 500, 250, 350]
            ]
        },
        zoom: {
            enabled: true,
            rescale: true
        },
        axis: {
            x: {
                label: 'Tiempo',
                type: 'timeseries',
                tick: {
                    format: '%Y-%m-%d'
                }             
            },
            y: {
                label: 'Tiempos de atención (en segundos)',            
            }
        },
    });
}

// ------------------------------------------------------
// DRAW CHART 2
// ------------------------------------------------------
function stackedBarChart(columnsData) {
    chart1 = c3.generate({
        size: {
            height: 500,
            width: 1200
        },
        bindto: '#stackedBarChart',
        data: {
            columns: columnsData,
            type: 'bar',
            groups: [
                dataEstados
            ]
        },
        axis: {
            rotated: true,
            x: {
                label: 'Tickets',
                type: 'category',
                categories: dataTickets                 
            },
            y: {
                label: 'Tiempo de atención (en segundos)',            
            }
        },
        legend: {
            position: 'right',
        },
        grid: {
            y: {
                lines: [{value:0}]
            }
        }
    });

    var firstLegend = d3.select(".c3-legend-item");
    var legendCon = d3.select(firstLegend.node().parentNode);
    var legendX = parseInt(firstLegend.select('text').attr('x'));
    var legendY = parseInt(firstLegend.select('text').attr('y'));
    legendCon
      .append('text')
      .text('Estado del incidente')
      .attr('x', legendX - 50)
      .attr('y', legendY - 50)
      .style('font-size', '16px');
}

// ADDITIONAL FUNCTIONS

function agregar() {
    chart1.groups([dataEstados]);
}

function desagregar() {
    chart1.groups([]);
}

// ANGULAR MANAGEMENT

// (function () {
//   var app = angular.module('manager', []);

//   app.controller('DateManagerController', function(){
//     var _this = this;
//     _this.socket = io();
//     _this.refrescar = refrescar;
//     _this.getValues = getValues;

//     _this.initialDate = '2012-07-31';
//     _this.finalDate = '2012-09-04';    

//     function refrescar() {
//       if (_this.initialDate && _this.finalDate){
//         getValuesFilters(_this.initialDate, _this.finalDate);
//       }
//     }

//     function getValuesFilters(initialDate, finalDate) {
//       json = {
//         'initialDate': initialDate,
//         'finalDate': finalDate,
//       };
//       _this.socket.emit(INITIALIZE,json);
//     }

//   });
// })();

