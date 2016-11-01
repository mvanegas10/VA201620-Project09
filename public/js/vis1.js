var tiposIncidentes = [];
var tiposEstados = [];

function stackedBarChart(columnsData) {
    console.log(tiposIncidentes);
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
        axis: {
            x: {
                label: 'Tipo de incidente',
                type: 'category',
                categories: tiposIncidentes
            },
            y: {
                label: 'Tiempo de atención (en días)',
                tick: {
                    format: function (x) { return (x/1000000000000) + " b"; }
                }                
            }
        },
        legend: {
            position: 'right'
        },
        grid: {
            y: {
                lines: [{value:0}]
            }
        }
    });
    var firstLegend = d3.select(".c3-legend-item");
    var legendCon = d3.select(firstLegend.node().parentNode);
    var legendY = parseInt(firstLegend.select('text').attr('y'));
    legendCon
      .append('text')
      .text('Estado del incidente')
      .attr('y', legendY - 20)
      .style('font-size', '16px');

    // setTimeout(function () {
    //     chart.groups(tiposIncidentes)
    // }, 1000);

}

function timeDifference(date2,date1) {
    return Math.floor(date1.getTime() - date2.getTime()/1000/60/60/24);
}

d3.csv("/data/diciembre2015.csv", function(err, data) {
    if(err) {
        console.err(err);    
        return; 
    }
    var tempInd = {};
    var tempEst = {};
    data.forEach(function (item) {
        tempInd[item.Tipos] = true;
        tempEst[item.Estado] = true;
        var tiempo = timeDifference(new Date(item.Creado.substring(0,item.Creado.indexOf(' '))), new Date(item.Cerrado.substring(0,item.Cerrado.indexOf(' '))));
        // item.tiempoAtencion = isNaN(tiempo)? 0: (tiempo > 1)? 1: tiempo;
        item.tiempoAtencion = isNaN(tiempo)? 0: tiempo;
    });
    tiposIncidentes = Object.keys(tempInd);
    var index = tiposIncidentes.indexOf("undefined");
    if (index > -1) {
        tiposIncidentes.splice(index, 1);
    }
    tiposEstados = Object.keys(tempEst);
    var dataStacked = [];
    tiposEstados.forEach(function (estado) {
        if (estado !== "undefined") {
            var column = [];
            column.push(estado);

            tiposIncidentes.forEach(function (incidente) {
                var sum = data.filter(function (d) {
                    if (d.Estado === estado && d.Tipos === tiposIncidentes[0]) return d;
                }).reduce(function (sum, current) { return sum + current.tiempoAtencion; }, 0);

                column.push(sum);
            })

            dataStacked.push(column);           
        }
    });
    stackedBarChart(dataStacked);
});

