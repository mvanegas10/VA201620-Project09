var INITIALIZE = 'INITIALIZE';
var SHOW_DATA = 'SHOW_DATA';
var GET_ESTADOS = 'GET_ESTADOS';
var GET_TICKETS = 'GET_TICKETS';
var SHOW_ESTADOS = 'SHOW_ESTADOS';
var SHOW_TICKETS = 'SHOW_TICKETS';

try {
	module.exports.INITIALIZE = INITIALIZE;
    module.exports.SHOW_DATA = SHOW_DATA;
    module.exports.GET_ESTADOS = GET_ESTADOS;
    module.exports.GET_TICKETS = GET_TICKETS;
    module.exports.SHOW_TICKETS = SHOW_TICKETS;
    module.exports.SHOW_ESTADOS = SHOW_ESTADOS;
    console.log('We are running on the server...');
} catch(err) {
    console.log('We are running on the browser...');
}
