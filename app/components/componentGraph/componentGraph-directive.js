(function (angular, d3, _) {

	function addGraph (el, links){

		var nodes = {};

		// Compute the distinct nodes from the links.
		links.forEach(function(link) {
		  link.source = nodes[link.source] || (nodes[link.source] = {name: link.source});
		  link.target = nodes[link.target] || (nodes[link.target] = {name: link.target});
		});

		var width = 300,
		    height = 300;

		var force = d3.layout.force()
		    .nodes(d3.values(nodes))
		    .links(links)
		    .size([width, height])
		    .linkDistance(80)
		    .charge(-400)
		    .on("tick", tick)
		    .start();

		var svg = d3.select(el).append("svg")
				.attr('viewBox', "0 0 " + width + " " + height)
    		.attr("preserveAspectRatio", "xMinYMin");

		// Per-type markers, as they don't inherit styles.
		svg.append("defs").selectAll("marker")
		    .data(["suit", "licensing", "resolved"])
		  .enter().append("marker")
		    .attr("id", function(d) { return d; })
		    .attr("viewBox", "0 -5 10 10")
		    .attr("refX", 15)
		    .attr("refY", -1.5)
		    .attr("markerWidth", 6)
		    .attr("markerHeight", 6)
		    .attr("orient", "auto")
		  .append("path")
		    .attr("d", "M0,-5L10,0L0,5");

		var path = svg.append("g").selectAll("path")
		    .data(force.links())
		  .enter().append("path")
		    .attr("class", function(d) { return "link " + d.type; })
		    .attr("marker-end", function(d) { return "url(#" + d.type + ")"; });

		var circle = svg.append("g").selectAll("circle")
		    .data(force.nodes())
		  .enter().append("circle")
		    .attr("r", 12)
		    .call(force.drag);

		var text = svg.append("g").selectAll("text")
		    .data(force.nodes())
		  .enter().append("text")
		    .attr("x", 14)
		    .attr("y", ".31em")
		    .text(function(d) { return d.name; });

		// Use elliptical arc path segments to doubly-encode directionality.
		function tick() {
		  path.attr("d", linkArc);
		  circle.attr("transform", transform);
		  text.attr("transform", transform);
		}

		function linkArc(d) {
		  var dx = d.target.x - d.source.x,
		      dy = d.target.y - d.source.y,
		      dr = Math.sqrt(dx * dx + dy * dy);
		  return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
		}

		function transform(d) {
		  return "translate(" + d.x + "," + d.y + ")";
		}	





	}
  

  angular.module('profiler.componentGraph')
  	.directive('componentGraph', function(){
			// Runs during compile
			return {
				// name: '',
				// priority: 1,
				// terminal: true,
				// scope: {}, // {} = isolate, true = child, false/undefined = no change
				// controller: function($scope, $element, $attrs, $transclude) {},
				// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
				// restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
				// template: '',
				// templateUrl: '',
				// replace: true,
				// transclude: true,
				// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
				link: function(scope, element, attrs) {
					
					addGraph(element[0], scope.links);
					
				}
			};
		});			





})(angular, d3, _);



