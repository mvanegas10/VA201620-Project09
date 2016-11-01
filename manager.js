(function () {
	var app = angular.module('manager', []);

		app.controller('ManagerController', function(){    
			function begin(){
		  _this.socket.emit(INITIALIZE);
		  _this.startSim = true;
		  _this.time = 0;
		}
	});
})();