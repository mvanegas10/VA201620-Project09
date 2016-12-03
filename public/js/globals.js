var INITIALIZE_DAYS = 'INITIALIZE_DAYS';
var INITIALIZE_STACKED = 'INITIALIZE_STACKED';
var SHOW_DATA = 'SHOW_DATA';
var SHOW_DAYS = 'SHOW_DAYS';
var GET_ESTADOS = 'GET_ESTADOS';
var GET_TICKETS = 'GET_TICKETS';
var SHOW_ESTADOS = 'SHOW_ESTADOS';
var SHOW_TICKETS = 'SHOW_TICKETS';
var GET_AVG = 'GET_AVG';
var SHOW_AVG = 'SHOW_AVG';

try {
	module.exports.INITIALIZE_DAYS = INITIALIZE_DAYS;
	module.exports.INITIALIZE_STACKED = INITIALIZE_STACKED;
    module.exports.SHOW_DATA = SHOW_DATA;
    module.exports.SHOW_DAYS = SHOW_DAYS;
    module.exports.GET_ESTADOS = GET_ESTADOS;
    module.exports.GET_TICKETS = GET_TICKETS;
    module.exports.SHOW_TICKETS = SHOW_TICKETS;
    module.exports.SHOW_ESTADOS = SHOW_ESTADOS;
    module.exports.GET_AVG = GET_AVG;
    module.exports.SHOW_AVG = SHOW_AVG;
    console.log('We are running on the server...');
} catch(err) {
    console.log('We are running on the browser...');
}
