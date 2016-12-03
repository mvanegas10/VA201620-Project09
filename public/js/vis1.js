// ------------------------------------------------------
// VARIABLES
// ------------------------------------------------------

var socket = io();
var dataDays = [];
var dataIncidentes = [];
var dataTickets = {};
var dataEstados = [];
var timeTickets = [];
var avg = 0.0;
var chart;
var chart1;
var msgSelection = [];
var zoom;
//violin plot
var duracionEstado= [];
var diaSemana =[];
var tipoEstado = [];


// ------------------------------------------------------
// MANAGE CONNECTION WITH BACKEND
// ------------------------------------------------------

socket.emit(GET_AVG," 1=1");
socket.emit(INITIALIZE_DAYS);
socket.emit(INITIALIZE_STACKED,"");

socket.on(SHOW_DAYS, function (data) {
    console.log(":! This is a " + SHOW_DAYS + " request...");
    dataDays = data;
    var dataX = ['x'];
    dataDays.forEach(function (d,i) {
        dataX.push((dataDays.length-1) - i);
    });
    var dataY = dataDays.map(function (d) {return d.duration;});
    dataY.unshift('Tiempo promedio en s');
    var dataZ = dataDays.map(function (d) {return d.weekday;});
    lineChart(dataX, dataY, dataZ);
});

socket.on(SHOW_AVG, function (data) {
    console.log(":! This is a " + SHOW_AVG + " request...");
    avg = data[0].avg;
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
function lineChart(dataX, dataY, dataZ, daySelected) {
    var dataAVG = Array.apply(null, Array(dataY.length)).map(Number.prototype.valueOf,Number(avg));
    dataAVG.unshift("promedio");     
    var arr = dataY.slice(0);
    arr.splice(0,1);
    arr = arr.map(Number);
    dataBG = Array.apply(null, Array(dataY.length)).map(Number.prototype.valueOf,Number(d3.max(d3.values(arr))));
    dataBG[0] = 'background';

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
                dataY,
                dataBG,
                dataAVG
            ],
            types: {
                y: 'line',
                background: 'bar',
                promedio: 'line',
            },
            selection: {
                enabled: true,
                multiple: true,
            },
            colors: {
                y: '#ff0000',
                background: '#99d8c9'
            },
            color: function (color,d) {
                if (d.index == 236) return '#810f7c';
                else if (d.id && d.id === 'background') {
                    if (daySelected && d.index === daySelected) return "#4d004b";
                    else if (dataZ[d.index] == 6 || dataZ[d.index] == 0) return "#99d8c9";
                    else return "#e5f5f9";
                }
                else if (daySelected && dataZ[d.index] === dataZ[daySelected])  return "#4d004b";
                else return color;
            },
            onclick: function (d) {
                chart1 = undefined;
                var prev = false;
                var it = 0;
                msgSelection.forEach(function(i) {
                    if (i.x === d.x) prev = true;
                });

                msgSelection = chart.selected();
                if (prev) {
                    var cant = 0;
                    msgSelection.forEach(function (selected,i) {
                        cant++;
                        if(selected.x === d.x) {
                            delete msgSelection[i];
                            cant--;
                        }
                    });
                    if(cant <= 0){
                        d3.select("#stackedBarChart").html("");
                        d3.select("#stackedBarChart").selectAll("*").remove();
                        chart.unselect(['Tiempo promedio en s','background']);
                        msgSelection = [];
                    }
                    if (d.x === daySelected) {
                        socket.emit(GET_AVG," weekday = " + dataZ[d.x]);
                        lineChart(dataX,dataY,dataZ);
                    }
                    else {
                        lineChart(dataX,dataY,dataZ,daySelected);
                    }
                }
                else {
                    socket.emit(GET_AVG," weekday = " + dataZ[d.x]);
                    socket.emit(INITIALIZE_STACKED,getQueryString());
                    lineChart(dataX,dataY,dataZ,d.x);
                }
            }
        },
        bar: {
            width: 4,
            interaction: {
                enabled: false
            }
        },        
        tooltip: {
            format: {
                title: function (d) {
                    if (d == 236) return 'HOY';
                    else return "Hace " + Math.round(dataDays.length - 1 - d)  + " días";
                },
                name: function (name, ratio, id, index) {
                    if (name === 'background') return "Día de la semana";
                    else return name;
                },
                value: function (value, ratio, id, index) {
                    if (id === 'background') {
                        if (dataZ[index] == 1) return "Lunes"
                        else if (dataZ[index] == 2) return "Martes";
                        else if (dataZ[index] == 3) return "Miércoles";
                        else if (dataZ[index] == 4) return "Jueves";
                        else if (dataZ[index] == 5) return "Viernes";
                        else if (dataZ[index] == 6) return "Sábado";
                        else if (dataZ[index] == 0) return "Domingo";
                    }
                    else return Math.round(Number(value)*100)/100;
                }
            }
        },
        zoom: {
            onzoomend: function (domain) {zoom = domain;},
            enabled: true,
            rescale: true
        },
        subchart: {
            show: true,
            size: {
                height: 20
            },
            axis: {
                x: {
                    show: false
                }
            }
        },
        axis: {
            x: {
                label: 'Día',
                tick: {
                    count: 50,
                    format: function (x) {
                        if (Math.round(dataDays.length - 1 - x) < 7) return "La semana pasada";
                        else if (Math.round(dataDays.length - 1 - x) > 30 && Math.round(dataDays.length - 1 - x) <= 60) return "El mes pasado";
                        else if (Math.round(dataDays.length - 1 - x) > 60 && Math.round(dataDays.length - 1 - x) <= 90) return "Hace dos meses";
                        else if (Math.round(dataDays.length - 1 - x) > 90 && Math.round(dataDays.length - 1 - x) <= 120) return "Hace tres meses";
                        else if (Math.round(dataDays.length - 1 - x) > 120 && Math.round(dataDays.length - 1 - x) <= 150) return "Hace cuatro meses";
                        else if (Math.round(dataDays.length - 1 - x) > 150 && Math.round(dataDays.length - 1 - x) <= 180) return "Hace cinco meses";
                        else if (Math.round(dataDays.length - 1 - x) > 180 && Math.round(dataDays.length - 1 - x) <= 210) return "Hace seis meses";
                        else if (Math.round(dataDays.length - 1 - x) > 210 && Math.round(dataDays.length - 1 - x) <= 240) return "Hace siete meses";
                        else return "Hace " + Math.round(dataDays.length - 1 - x)  + " días";
                    }
                }
            },
            y: {
                label: 'Tiempo promedio en s',
            }
        },
        legend: {
            show: false,
        },
    });
    msgSelection.forEach(function (selected) {
        chart.select('Tiempo promedio en s',msgSelection.map(function (d) {return d.x;}));
    });
    if (zoom !== undefined) chart.zoom(zoom);
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

function giveDayString(num) {
    if (num == 1) return "lunes";
    else if (num == 2) return "martes";
    else if (num == 3) return "miércoles";
    else if (num == 4) return "jueves";
    else if (num == 5) return "viernes";
    else if (num == 6) return "sábado";
    else if (num == 0) return "domingo";
}

function agregar() {
    chart1.groups([dataEstados]);
}

function desagregar() {
    chart1.groups([]);
}

function getQueryString() {
    var answer;
    msgSelection.forEach(function (d) {
        if(answer === undefined) answer = " date(time_begin_current) = '" + dataDays[d.x]["day"].substring(0,10) + "'";
        else answer += " OR date(time_begin_current) = '" + dataDays[d.x]["day"].substring(0,10) + "'";
    });
    return answer;
}
