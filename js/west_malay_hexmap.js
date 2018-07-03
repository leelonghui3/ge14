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

  var infoBox = mapContainer.append('svg')
    .attr('width', 400)
    .attr('height', 400)
    .attr('x', (width / 2))
    .attr('y', 150);

  var constituency = infoBox.append('text')
    .attr('x', 0)
    .attr('y', 30)
    .text('');

  var state = infoBox.append('text')
    .attr('x', 0)
    .attr('y', 60)
    .text('')
    .text('');

  var coallitionColor = infoBox.append('rect')
    .attr('width', 35)
    .attr('height', 35)
    .attr('x', 0)
    .attr('y', 70)
    .style('opacity', '0');

  var winner = infoBox.append('text')
    .attr('x', 40)
    .attr('y', 93)
    .text('');

  var majority = infoBox.append('text')
    .attr('x', 0)
    .attr('y', 130)
    .text('');

  // credit
  mapContainer.append('text')
    .attr('x', width)
    .attr('y', (height - 5))
    .attr('class', 'credit')
    .attr('text-anchor', 'end')
    .text("Credit: YS Fang (Tindak M'sia, 2018), M'sia Election Commission (2018), Malaysiakini (2008)");

  // legend
  // var size = 200;
  // var legend_coallition = ['Pakatan Harapan (97 seats)', 'Barisan Nasional (49 seats)', 'PAS (18 seats)', 'Independent (1 seat)'];
  // var legend = mapContainer.append('svg')
  //   .attr('width', 300)
  //   .attr('height', (size * 2))
  //   .attr('x', (width - 250))
  //   .attr('y', (height - 200))
  //   .selectAll('g')
  //   .data(legend_coallition)
  //   .enter()
  //   .append('g')
  //   .attr('transform', function(d, i) {
  //     return "translate(0," + i * 40 + ")";
  //   });
  //
  // legend.append('rect')
  //   .attr('width', 36)
  //   .attr('height', 36)
  //   .attr('class', function(d) {
  //     if (d === 'Pakatan Harapan (97 seats)') {
  //       return 'ph';
  //     } else if (d === 'PAS (18 seats)') {
  //       return 'pas';
  //     } else if (d === 'Barisan Nasional (49 seats)') {
  //       return 'bn';
  //     } else {
  //       return 'ind';
  //     }
  //   })
  //   .attr('stroke', '#D3D3D3')
  //   .attr('stroke-width', '1');
  //
  // legend.append('text')
  //   .attr('x', 40)
  //   .attr('y', 15)
  //   .attr('dy', '0.5em')
  //   .attr('text-anchor', 'start')
  //   .attr('class', 'legend')
  //   .text(function(d) {
  //     return d;
  //   });

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
        d3.select(this).classed('malay_color', false);
        d3.select(this).classed('active', true);
        showInfo.call(this, d);
      })
      .on('mouseout', function(d) {
        d3.select(this).classed('malay_color', true);
        d3.select(this).classed('active', false);
        removeInfo.call(this, d);
      });

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

    function malay_color(d) {
      return quantize(d.ge14_malay);
    }

    function showInfo(d) {
      instruction.text('');

      constituency.text(d.constituency + ' (' + d.ge14_malay + '% Malay voters)')
        .attr('class', 'constituency');

      state.text('State: ' + d.state)
        .attr('class', 'state');

      coallitionColor.style('opacity', 1)
        .attr('class', const_color(d));

      winner.text('Winning Party: ' + d.ge14_win_coallition + ' - ' + d.ge14_win_party)
        .attr('class', 'winner');

      majority.text('Majority: ' + d3.format(',')(d.ge14_majority) + ' votes (' + d.ge14_majority_pct + '%)')
        .attr('class', 'majority');
    }

    function removeInfo() {
      instruction.text('Mouse over/tab to see details');
      constituency.text('');
      state.text('');
      coallitionColor.style('opacity', 0);
      winner.text('');
      majority.text('');
    }
  });
});
