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
var msgSelection = [];

// ------------------------------------------------------
// MANAGE CONNECTION WITH BACKEND
// ------------------------------------------------------

socket.emit(INITIALIZE_DAYS);
socket.emit(INITIALIZE_STACKED,"");

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
    socket.emit(GET_ESTADOS,getQueryString());
});

socket.on(SHOW_ESTADOS, function (data) {
    console.log(":! This is a " + SHOW_ESTADOS + " request...");
    dataEstados = data.map(function (d) {return d.current_state;});
    socket.emit(GET_TICKETS,getQueryString());
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
            height: 150,
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
                chart1 = undefined;
                if(chart.selected().length === 0){
                    d3.select("#stackedBarChart").html("");
                    d3.select("#stackedBarChart").selectAll("*").remove();
                }
                else socket.emit(INITIALIZE_STACKED,getQueryString());
            }
        },
        zoom: {
            enabled: true,
            rescale: true
        },
        axis: {
            x: {
                // show: false,                
                label: 'Día',
                type: 'timeseries',
                tick: {
                    format: '%Y-%m-%d',
                    count: 24
                }             
            },
            y: {
                // show: false,
                label: 'Tiempos (en segundos)',       
            }
        },
        legend: {
            show: false,
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
            width: 1000
        },
        bindto: '#stackedBarChart',
        data: {
            columns: columnsData,
            type: 'bar',
            groups: [
                dataEstados
            ],
        },
        color: {
            pattern: ['#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78', '#2ca02c', '#98df8a', '#d62728', '#ff9896', '#9467bd', '#c5b0d5', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5']
        },        
        axis: {
            rotated: true,
            x: {
                label: 'Tickets',
                type: 'category',
                categories: dataTickets,
                tick: {
                    culling: {
                        max: 40
                    }  
                }            
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

function getQueryString() {
    var answer;
    msgSelection = chart.selected();
    msgSelection.forEach(function (d) {
        if(answer === undefined) answer = " date(time_begin_current) = '" + d.x.toISOString().substring(0,10) + "'";
        else answer += " OR date(time_begin_current) = '" + d.x.toISOString().substring(0,10) + "'";
    });
    return answer;
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

