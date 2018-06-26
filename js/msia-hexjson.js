$(document).ready(function() {

  // Set the size and margins of the svg
  var margin = {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10
    },
    width = 1200 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

  // Create the svg element
  var svg = d3
    .select("#msia")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.json("data/msia-1.hexjson", function(error, hexjson) {
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
      .append('polygon')
      .attr('points', function(hex) {
        return hex.points;
      })
      .attr('stroke', '#3d3d3d')
      .attr('stroke-width', '2')
      .attr('class', const_color);

    // Add the hex codes as labels
    hexmap
      .append("text")
      .append("tspan")
      .attr("text-anchor", "middle")
      .text(function(hex) {
        return hex.key;
      })
			.style('fill', function(d) {
				if (d.ge14_win_coallition === 'IND' || d.ge14_win_coallition === 'SOLIDARITI') {
					return '#333333';
				} else {
					return '#ffffff'
				}
			})
			.style('font-size', 'small');

  function const_color(d) {
    if (d.ge14_win_coallition === 'PH')
      return 'ph';
    else if (d.ge14_win_coallition === 'PAS')
      return 'pas';
    else if (d.ge14_win_coallition === 'BN')
      return 'bn';
    else if (d.ge14_win_coallition === 'SOLIDARITI')
      return 'solidariti';
    else {
      return 'ind';
    }
  }
});
});
