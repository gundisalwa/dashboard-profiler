(function (angular, _) {
  

  angular.module('profiler.componentGraph')
	  .service('DashboardGraph', [ function(){
	  	function getNodes(){
	  		return Dashboards.components;
	  	}

	  	function getLinks(){

	  	} 


	  	return {
	  		getNodes: getNodes,
	  		getLinks: getLinks
	  	}
	  }]);

})(angular, _);



