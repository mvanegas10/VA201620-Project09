// ------------------------------------------------------
// VARIABLES
// ------------------------------------------------------

var socket = io();
var dataDays = [];
var dataIncidentes = [];
var dataTickets = {};
var dataEstados = [];
var dataPromEstados = [];
var timeTickets = [];
var tiempoID=[];
var avgTickets=[];
var dataScatter=[];
var avg = 0.0;
var chart;
var chart1;
var table =[];
var msgSelection = [];
var zoom;
//violin plot
var duracionEstado= [];
var diaSemana =[];
var tipoEstado = [];
var cincoDiasSeleccionados = [];
var dataTable=[];

// ------------------------------------------------------
// MANAGE CONNECTION WITH BACKEND
// ------------------------------------------------------

socket.emit(INITIALIZE_DAYS);
socket.emit(INITIALIZE_STACKED,"");
socket.emit(INITIALIZE_STATES_VIOLIN);
socket.on(SHOW_DAYS, function (data) {
	console.log(":! This is a " + SHOW_DAYS + " request...SHOW");
	dataDays = data;
	console.log(data)
	var dataX = ['x'];
	dataDays.forEach(function (d,i) {
		dataX.push((dataDays.length-1) - i);
	});
	var dataY = dataDays.map(function (d) {return d.duration;});
	dataY.unshift('Tiempo promedio en s');
	var dataZ = dataDays.map(function (d) {return d.weekday;});
	lineChart(dataX, dataY, dataZ);
});

socket.on(SHOW_DATA, function (data) {
	console.log(":! This is a " + SHOW_DATA + " request...");
	console.log(data);
	dataIncidentes = data;
	socket.emit(GET_ESTADOS,getQueryString());
});

socket.on(INITIALIZE_DAYS_VIOLIN, function (data) {
	console.log(":! This is a " + INITIALIZE_DAYS_VIOLIN + " request... DATOSTABLA");
	dataTable = data;
});

socket.on(SHOW_ESTADOS, function (data) {
	socket.emit(GET_STATE_AVG);
	console.log(":! This is a " + SHOW_ESTADOS + " request...");
	dataEstados = data.map(function (d) {return d.current_state;});
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

	//scatterplot
	dataIncidentes.forEach(function (d) {
		if (tiempoID[d.ticket_id] === undefined) {
			tiempoID[d.ticket_id] = {};
		}
		tiempoID[d.ticket_id][d.current_state] = d.duration;
	})
	 dataScatter=[];
	console.log(data);

	 dataTickets.forEach(function (d) {
 		var def = [];
 		def.push(d);
 		dataEstados.forEach(function (s) {
 			if (tiempoID[d][s] === undefined) tiempoID[d][s] = 0.0;
 			else tiempoID[d][s] = +tiempoID[d][s];
 			def.push(tiempoID[d][s]);
 		})
 		dataScatter.push(def);
 	})
	scatterplot(dataScatter);
});

socket.on(SHOW_STATE_AVG, function (data) {
	console.log(":! This is a " + SHOW_STATE_AVG + " request...");
	dataTickets = data;
	var def=[];
	def[0]={};
	def[1]={};
	def[2]={};
	var def2=[];
	var def3=[];
	var def4= [];
	avgTickets=[];
	def2.push("Maximo")
	def3.push("Minimo");
	def4.push("Promedio");
	dataTickets.forEach(function (d) {
		dataEstados.forEach(function(s) {
			if(d.current_state.localeCompare(s)===0)
			{
				def[0][d.current_state]=d.MaxTime;
				def2.push(def[0][d.current_state])
				def[1][d.current_state]=d.MinTime;
				def3.push(def[1][d.current_state])
				def[2][d.current_state]=d.avgTime;
				def4.push(def[2][d.current_state])
			}
		})
	})
	avgTickets.push(def2);
	avgTickets.push(def3);
	avgTickets.push(def4);
	socket.emit(GET_TICKETS,getQueryString());

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
				isselectable: function(d) {
					return !(d.id === "promedio");
				}
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
				else if (d.id && d.id === 'promedio')  return "#4d004b";
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
						d3.select("#scatterplot").html("");
						d3.select("#scatterplot").selectAll("*").remove();
						chart.unselect(['Tiempo promedio en s','background']);
						msgSelection = [];
					}
					if (d.x === daySelected) {
						lineChart(dataX,dataY,dataZ);
						socket.emit(INITIALIZE_STACKED,getQueryString());

					}
					else {
						lineChart(dataX,dataY,dataZ,daySelected);
						socket.emit(INITIALIZE_STACKED,getQueryString());
					}
				}
				else {
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
					else if (name === 'promedio'){
						if (daySelected !== undefined) return "Promedio de los días " + giveDayString(dataZ[daySelected]);
						else return "Promedio";
					}
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
		transition: {
			duration: null
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
	console.log("Selecciona dia"+ selected);
	chart.select('Tiempo promedio en s',msgSelection.map(function (d) {return d.x;}));
});
if (zoom !== undefined) chart.zoom(zoom);
}

// ------------------------------------------------------
// DRAW CHART 2
// ------------------------------------------------------
function stackedBarChart(columnsData) {
	if(columnsData.length !== 0){
		chart1 = c3.generate({
			size: {
				height: 500,
				width: 680
			},
			bindto: '#stackedBarChart',
			data: {
				columns: columnsData,
				type: 'bar',
				groups: [
				dataEstados
				],
				onclick: function (k) {
					console.log(k.value);
				},
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
		.attr('x', legendX -200)
		.attr('y', legendY -50)
		.style('font-size', '16px');
	}
}
// visualizacion scatterplot
function scatterplot(dataScatter) {
	var columns = dataScatter.concat(avgTickets);
	console.log(columns)
	var chart2 = c3.generate({
		size: {
			height: 500,
			width: 680
		},
		bindto: '#scatterplot',
		data: {
			columns:columns,
			type: 'scatter',
			types:{
				Maximo: 'spline',
				Minimo: 'spline',
				Promedio:'spline'
			},
			selection: {
				enabled: true,
				multiple: true,
				isselectable: function(d) {
					return !(d.name === "Maximo");
				}
			},
			onclick: function (d) {
				if(d.name.localeCompare("Maximo")!=0&&d.name.localeCompare("Minimo")!=0&&d.name.localeCompare("Promedio")!=0)
				{
					var prev=false;
					table.forEach(function(i) {
						if (i.id.localeCompare(d.id)===0) prev = true;
					});

					table = chart2.selected();

					if (prev) {
						var cant = 0;
						table.forEach(function (selected,i) {
							cant++;
							if(selected.id.localeCompare(d.id)===0) {
								delete table[i];
								chart2.unselect('['+table.map(function (d) {return d.name;})+']');
								cant--;
							}
						});
						if(cant <= 0){
							d3.select("#dvTable").html("");
							d3.select("#dvTable").selectAll("*").remove();
							table = [];
						}
						else
						{
							pintarTabla();
							scatterplot(dataScatter);
						}
					}
					else {
						pintarTabla();
						scatterplot(dataScatter);
					}
				}
			}
		},
		legend:{
			show:false
		},
		axis: {
			rotated:true,
			x: {
				label: 'Estados',
				type: 'category',
				categories: dataEstados,
				padding: {left: 0},
			  min: 0,
				tick: {
					fit:true,
					culling: {
						max: 40
					}
				}
			},
			y: {
				label: 'Tiempo (minutos)',
				padding: {bottom: 10},
				min: 0
			}
		}
	});

	table.forEach(function (selected) {
		chart2.select('['+table.map(function (d) {return d.name;})+']');
	});

	d3.select(".container").selectAll("*").remove();
	d3.select('.container').insert('div', '.scatterplot').attr('class', 'legend').selectAll('div')
	    .data(['Maximo', 'Minimo', 'Promedio'])
	  .enter().append('div')
		.attr('data-id', function(id) {
						return id;
			})
			.html(function(id) {
			return id;
			})
			.each(function(id) {
			//d3.select(this).append('span').style
			d3.select(this).append('span').style('background-color', chart2.color(id));
			})
			.on('mouseover', function(id) {
			chart2.focus(id);
			})
			.on('mouseout', function(id) {
			chart2.revert();
			})
			.on('click', function(id) {
			$(this).toggleClass("c3-legend-item-hidden")
			chart2.toggle(id);
			});
}

//--------------------------------
//TABLA
//---------------------------------

function pintarTabla()
{
	var tablafinal=[];
	var tablaP=[];
	table.forEach(function (d) {
		if (tablaP[d.id] === undefined) {
			console.log(d.id)
			tablaP[d.id] = {};
			tablafinal.push(d);
		}
	})
	var data=[];
	tablafinal.forEach(function(s){
		dataTable.forEach(function(d){
			if(s.id.localeCompare(d.ticket_id)===0)
			{
				data.push(d);
			}
		})
	})
	var tableTable = document.createElement("TABLE");
		tableTable.border = "1";

		//Get the count of columns.
		var headers = ["id_ticket","Current state","Time begin current","Ticket type", "Time in State"]
		var columnCount = headers.length;

		//Add the header row.
					 var row = tableTable.insertRow(-1);
					 for (var i = 0; i < columnCount; i++) {
							 var headerCell = document.createElement("TH");
							 headerCell.innerHTML = headers[i];
							 row.appendChild(headerCell);
					 }

		//Add the data rows.
					 for (var i = 1; i < data.length; i++) {
							 row = tableTable.insertRow(-1);
							 for (var j = 0; j < columnCount; j++) {
									 var cell = row.insertCell(-1);
									 if(j==0)
									 {
										 cell.innerHTML = data[i].ticket_id;
									 }
									else if(j==1)
									 {
										 cell.innerHTML = data[i].current_state;
									 }
									 else if(j ==2)
									 {
										 cell.innerHTML = data[i].time_begin_current;
									 }
									 else if(j ==3)
									 {
										 cell.innerHTML = data[i].ticket_typo;
									 }
									 else {
										 cell.innerHTML = data[i].timeState;
									 }
							 }
					 }




					 //create table in html
					 var dvTable = document.getElementById("dvTable");

			 dvTable.innerHTML = "";
			 dvTable.appendChild(tableTable);
}

function pintarTabla2(data)
{
	var table = document.createElement("TABLE");
table.border = "1";
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

function getDataDays() {
	var answer;
	msgSelection.forEach(function (d) {
		if(answer === undefined) answer = " weekday = " + dataDays[d.x]["weekday"];
		else answer += " OR weekday = " + dataDays[d.x]["weekday"];
	});
	return answer;
}

function getNecesaryWeekday() {
	var answer;
	msgSelection.forEach(function (d) {
		if(answer === undefined) answer = " weekday = " + dataDays[d.x]["weekday"];
		else answer += " OR weekday = " + dataDays[d.x]["weekday"];
	});
	return answer;
}

function getQueryString() {
	var answer;
	msgSelection.forEach(function (d) {
		if(answer === undefined) answer = " date(time_begin_current) = '" + dataDays[d.x]["day"].substring(0,10) + "'";
		else answer += " OR date(time_begin_current) = '" + dataDays[d.x]["day"].substring(0,10) + "'";
	});
	return answer;
}
