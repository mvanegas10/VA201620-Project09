(function () {
  angular.module('dates', [])
  .controller('DateSelectionController', function() {
    var _this = this;
    _this.initialData = [];
    _this.socket = io();   
    _this.initialize = initialize; 

    _this.socket.on(SHOW_DATA, function (msg) {
      console.log(':! This is a ' + SHOW_DATA + ' request...');
      showChart(msg);
    });

    function initialize () {
      console.log("hola")
      _this.socket.emit(INITIALIZE);
    }

  })
})();
