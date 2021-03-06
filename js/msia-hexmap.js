$(document).ready(function() {

  // Set the size and margins of the svg
  var margin = {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10
    },
    width = 1400 - margin.left - margin.right,
    height = 900 - margin.top - margin.bottom;

  // Create the svg element
  var svg = d3
    .select("#vis")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.json("data/west.hexjson", function(error, hexjson) {
    // Render the hexes
    var hexes = d3.renderHexJSON(hexjson, width, height);

    // Bind the hexes to g elements of the svg and position them
    var hexmap = svg
      .selectAll("g")
      .data(hexes)
      .enter()
      .append("g")
      .attr("transform", function(hex) {
        return "translate(" + hex.x + "," + hex.y + ")";
      });

    // Draw the polygons around each hex's centre
    hexmap
      .append("polygon")
      .attr("points", function(hex) {
        return hex.points;
      })
      .attr("stroke", "white")
      .attr("stroke-width", "2")
      .attr("fill", function(d) {
				if (d.State === "jh") {
					return 'blue';
				} else if (d.State === "N9" || d.State === 'kd'){
					return 'red';
				} else if (d.State === 'mlk' || d.State === 'swk') {
					return 'orange';
				} else if (d.State === 'sel') {
					return 'yellow';
				} else if (d.State === 'ft' || d.State === 'pr') {
					return '#4682b4';
				} else if (d.State === 'ph') {
					return 'lightgrey';
				} else if (d.State === 'tg') {
					return 'purple'
				} else if (d.State === 'pk') {
          return '#333333';
        } else if (d.State === 'kt') {
          return 'green';
        } else if (d.State === 'pg' || d.State === 'sb') {
          return 'cyan';
        }

			});

    // Add the hex codes as labels
    hexmap
      .append("text")
      .append("tspan")
      .attr("text-anchor", "middle")
      .text(function(hex) {
        return hex.key;
      })
			.style('fill', function(d) {
				if (d.State === 'sel' || d.State === 'pg' || d.State === 'sb') {
					return '#333333';
				} else {
					return '#ffffff'
				}
			})
			.style('font-size', 'small');
  });

});
