var INITIALIZE = 'initialize';
var SHOW_DATA = 'show data';

try {
    module.exports.INITIALIZE = INITIALIZE;
    module.exports.SHOW_DATA = SHOW_DATA;
    console.log('We are running on the server...');
} catch(err) {
    console.log('We are running on the browser...');
}
