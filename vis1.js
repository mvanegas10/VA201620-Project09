d3.csv("/data/diciembre2015.csv", function(err, data) {
    if(err) {
        console.err(err);    
    return;
    }
    data.forEach(function (item) {
        console.log(item);
    })
});