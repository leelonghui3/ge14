$(document).ready(function() {

  // Set the size and margins of the svg
  var margin = {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10
    },
    width = 1200 - margin.left - margin.right,
    height = 550 - margin.top - margin.bottom;

  // Create the svg element
  var mapContainer = d3
    .select('#west-malay-hexmap')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  var quantize = d3.scaleQuantize()
    .domain([0, 100])
    .range(d3.range(5).map(function(i) {
      return "q" + i + "-5";
    }));

  var instruction = mapContainer.append('text')
    .attr('x', (width * 0.5))
    .attr('y', 120)
    .text('Mouse over/tab to see details');

  var constituency = mapContainer.append('text')
    .attr('text-anchor', 'start')
    .attr('y', 150)
    .attr('x', (width * 0.5))
    .text('');

  var state = mapContainer.append('text')
    .attr('text-anchor', 'start')
    .attr('y', 180)
    .attr('x', (width * 0.5))
    .text('');

  var winner = mapContainer.append('text')
    .attr('text-anchor', 'start')
    .attr('y', 210)
    .attr('x', (width * 0.5))
    .text('');

  var majority = mapContainer.append('text')
    .attr('text-anchor', 'start')
    .attr('y', 240)
    .attr('x', (width * 0.5))
    .text('');

  // credit
  mapContainer.append('text')
    .attr('x', width)
    .attr('y', (height - 5))
    .attr('class', 'credit')
    .attr('text-anchor', 'end')
    .text("Credit: YS Fang (Tindak M'sia, 2018), M'sia Election Commission (2018), Malaysiakini (2008)");

  // legend
  var size = 200;

  var legend_malay = ['20', '40', '60', '80+', ''];

  var legendTitle = mapContainer.append('text')
    .attr('x', (width * 0.5))
    .attr('y', 40)
    .attr('width', 300)
    .attr('height', 20)
    .text('Malay voters percentage (%)');

  var legend = mapContainer.append('svg')
    .attr('width', 300)
    .attr('height', 100)
    .attr('x', (width * 0.5))
    .attr('y', 50)
    .selectAll('g')
    .data(legend_malay)
    .enter()
    .append('g')
    .attr('transform', function(d, i) {
      return 'translate(' + i * 40 + ", 0)";
    });

  legend.append('rect')
    .attr('width', 40)
    .attr('height', 10)
    .attr('class', function(d, i) {
      return "q" + i + "-5";
    });

  legend.append('text')
    .attr('x', 35)
    .attr('y', 20)
    .attr('dy', '0.5em')
    .attr('text-anchor', 'start')
    .attr('class', 'legend')
    .text(function(d) {
      return d;
    });

  d3.json("data/west.hexjson", function(error, hexjson) {
    // Render the hexes
    var hexes = d3.renderHexJSON(hexjson, width, height);

    // Bind the hexes to g elements of the svg and position them
    var hexmap = mapContainer
      .selectAll("g")
      .data(hexes)
      .enter()
      .append("g")
      .attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      });

    // Draw the polygons around each hex's centre
    hexmap
      .append('polygon')
      .attr('points', function(d) {
        return d.points;
      })
      .attr('stroke', '#D3D3D3')
      .attr('stroke-width', '1')
      .attr('class', malay_color)
      .on('mouseover', function(d) {
        d3.select(this).classed('const_color', false);
        d3.select(this).classed('active', true);
        showInfo.call(this, d);
      })
      .on('mouseout', function(d) {
        d3.select(this).classed('const_color', true);
        d3.select(this).classed('active', false);
        removeInfo.call(this, d);
      });

    function malay_color(d) {
      return quantize(d.ge14_malay);
    }

    function showInfo(d) {

      instruction.text('');

      constituency.text(d.constituency + ' (' + d.ge14_malay + '% Malay voters)')
        .attr('class', 'constituency');

      state.text('State: ' + d.state)
        .attr('class', 'state');

      winner.text('Winning Party: ' + d.ge14_win_coallition + ' - ' + d.ge14_win_party)
        .attr('class', 'winner');

      majority.text('Majority: ' + d3.format(',')(d.ge14_majority) + ' votes (' + d.ge14_majority_pct + '%)')
        .attr('class', 'majority');
    }

    function removeInfo() {

      instruction.text('Mouse over/tab to see details.');
      constituency.text('');
      state.text('');
      winner.text('');
      majority.text('');
    }
  });
});
