// ------------------------------------------------------
// VARIABLES
// ------------------------------------------------------

var socket = io();
var dataIncidentes = [];
var dataTickets = {};
var dataEstados = [];
var timeTickets = [];

// ------------------------------------------------------
// MANAGE CONNECTION WITH BACKEND
// ------------------------------------------------------

var msg = {"initialState":'2012-07-31', "finalState":'2012-09-04'}
socket.emit(INITIALIZE,msg);

socket.on(SHOW_DATA, function (data) {
    console.log(":! This is a " + INITIALIZE + " request...");
    dataIncidentes = data;
    socket.emit(GET_ESTADOS,msg);
});

socket.on(SHOW_ESTADOS, function (data) {
    console.log(":! This is a " + SHOW_ESTADOS + " request...");
    dataEstados = data.map(function (d) {return d.state_name});
    socket.emit(GET_TICKETS,msg);
})

socket.on(SHOW_TICKETS, function (data) {
    console.log(":! This is a " + SHOW_TICKETS + " request...");
    dataTickets = data.map(function (d) {return d.ticket_id});

    console.log(dataIncidentes);
    console.log(dataEstados);
    console.log(dataTickets);

    dataIncidentes.forEach(function (d) {
        if (timeTickets[d.state_name] === undefined) {
            timeTickets[d.state_name] = {};
        }
        timeTickets[d.state_name][d.ticket_id] = d.elapsed_time;
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

function stackedBarChart(columnsData) {
    var chart = c3.generate({
        size: {
            height: 300,
            width: 900
        },
        bindto: '#stackedBarChart',
        data: {
            columns: columnsData,
            type: 'bar',
            // groups: [
            //     ['data1', 'data2']
            // ]
        },
        zoom: {
            enabled: true
        },
        axis: {
            x: {
                label: 'Tickets',
                type: 'category',
                categories: dataTickets,
                tick: {
                    format: function (x) { return "Ticket No." + (x); }
                }                  
            },
            y: {
                label: 'Tiempo de atención (en segundos)',
                // tick: {
                //     format: function (x) { return (x) + " b"; }
                // }                
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

