// ------------------------------------------------------
// VARIABLES
// ------------------------------------------------------

var socket = io();
var dataDays = [];
var dataIncidentes = [];
var dataTickets = {};
var dataEstados = [];
var timeTickets = [];
var chart;
var chart1;
var msg = " time_begin_current BETWEEN '2016-06-13' AND '2016-06-14'";
var msgSelection = undefined;

// ------------------------------------------------------
// MANAGE CONNECTION WITH BACKEND
// ------------------------------------------------------

socket.emit(INITIALIZE_DAYS);
socket.emit(INITIALIZE_STACKED,msg);

socket.on(SHOW_DAYS, function (data) {
    console.log(":! This is a " + SHOW_DAYS + " request...");
    dataDays = data;
    dataX = dataDays.map(function (d) {return d.day.substring(0,10);})
    dataX.unshift('x');
    dataY = dataDays.map(function (d) {return d.duration;});
    dataY.unshift('Tiempo en segundos');    
    dataZ = dataDays.map(function (d) {return d.weekday;});
    lineChart(dataX, dataY, dataZ);
});

socket.on(SHOW_DATA, function (data) {
    console.log(":! This is a " + SHOW_DATA + " request...");
    dataIncidentes = data;
    if (msgSelection !== undefined) socket.emit(GET_ESTADOS,msgSelection);
    else  socket.emit(GET_ESTADOS,msg);
});

socket.on(SHOW_ESTADOS, function (data) {
    console.log(":! This is a " + SHOW_ESTADOS + " request...");
    dataEstados = data.map(function (d) {return d.current_state;});
    if (msgSelection !== undefined) socket.emit(GET_TICKETS,msgSelection);
    else  socket.emit(GET_TICKETS,msg);
})

socket.on(SHOW_TICKETS, function (data) {
    console.log(":! This is a " + SHOW_TICKETS + " request...");    
    dataTickets = data.map(function (d) {return d.ticket_id;});

    // console.log(dataIncidentes);
    // console.log(dataEstados);
    // console.log(dataTickets);

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
function lineChart(dataX, dataY, dataZ) {
    chart = c3.generate({
        size: {
            height: 200,
            width: 1225
        },
        bindto: '#lineChart',
        data: {
            x: 'x',
            columns: [
                dataX,
                dataY
            ],
            selection: {
                enabled: true,
                multiple: true,
            },
            color: function (color,d) {
                return (dataZ[d.index] == 5 || dataZ[d.index] == 6)? "#d00" : "#ddd";
            },
            onclick: function (d, element) {
                if (msgSelection === undefined) msgSelection = " date(time_begin_current) = '" + d.x.toISOString().substring(0,10) + "'";
                else msgSelection += " OR date(time_begin_current) = '" + d.x.toISOString().substring(0,10) + "'";
                chart1 = undefined;
                var dataIncidentes = [];
                var dataTickets = {};
                var dataEstados = [];
                var timeTickets = [];
                socket.emit(INITIALIZE_STACKED,msgSelection);
            }
        },
        zoom: {
            enabled: true,
            rescale: true
        },
        axis: {
            x: {
                label: 'Día',
                type: 'timeseries',
                tick: {
                    format: '%Y-%m-%d'
                }             
            },
            y: {
                label: 'Tiempos (en segundos)',            
            }
        },
        legend: {
            show: false,
        },
    });
    // chart.hide(['color']);
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

