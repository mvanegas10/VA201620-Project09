(function () {
  var app = angular.module('manager', []);

  app.controller('DateManagerController', function(){
    var _this = this;
    _this.refrescar = refrescar;
    _this.getValues = getValues;

    _this.initialDate = '2012-07-31';
    _this.finalDate = '2012-09-04';    

    function refrescar() {
      if (_this.initialDate && _this.finalDate){
        getValuesFilters(_this.initialDate, _this.finalDate);
      }
    }

    function getValues(initialDate, finalDate) {
      if (_this.initialDate && _this.finalDate){
        getValuesFilters(_this.initialDate, _this.finalDate);
      }
    }

    function getValuesFilters(initialDate, finalDate) {
      json = {
        'initialDate': initialDate,
        'finalDate': finalDate,
      };
      socket.emit(INITIALIZE,json);
    }

  });
})();