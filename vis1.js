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
                type: 'category',
                categories: tiposIncidentes
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

            var sum1 = data.filter(function (d) {
                if (d.Estado === estado && d.Tipos === tiposIncidentes[0]) return d;
            }).reduce(function (sum, current) { return sum + current.tiempoAtencion; }, 0);

            column.push(sum1);

            var sum2 = data.filter(function (d) {
                if (d.Estado === estado && d.Tipos === tiposIncidentes[1]) return d;
            }).reduce(function (sum, current) { return sum + current.tiempoAtencion; }, 0);

            column.push(sum2); 

            dataStacked.push(column);           
        }
    });
    stackedBarChart(dataStacked);
});

