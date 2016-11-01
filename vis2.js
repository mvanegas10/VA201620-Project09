d3.csv("/data/tickets_history_may-jul.csv", function(err, data) {
    if(err) {
        console.err(err);    
        return; 
    }
    console.log(data[0])
    // stackedBarChart(dataStacked);
});

