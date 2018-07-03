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
  var mapContainer = d3
    .select('#east')
    .append('svg')
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  var instruction = mapContainer.append('text')
    .attr('x', (width * 0.2))
    .attr('y', 100)
    .text('Mouse over/tab to see details');

    var infoBox = mapContainer.append('svg')
      .attr('width', 400)
      .attr('height', 400)
      .attr('x', (width * 0.2))
      .attr('y', 120);

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

  d3.json('data/east.hexjson', function(error, hexjson) {
    // Render the hexes
    var hexes = d3.renderHexJSON(hexjson, width, height);

    // Bind the hexes to g elements of the svg and position them
    var hexmap = mapContainer
      .selectAll('g')
      .data(hexes)
      .enter()
      .append('g')
      .attr('transform', function(hex) {
        return 'translate(' + (hex.x + 200) + ',' + hex.y + ')';
      });

    // Draw the polygons around each hex's centre
    hexmap
      .append('polygon')
      .attr('points', function(hex) {
        return hex.points;
      })
      .attr('stroke', '#D3D3D3')
      .attr('stroke-width', '1')
      .attr('class', ge13_const_color)
      .on('mouseover', function(d) {
        d3.select(this).classed('ge13_const_color', false);
        d3.select(this).classed('active', true);
        showGE13Info.call(this, d);
      })
      .on('mouseout', function(d) {
        d3.select(this).classed('ge13_const_color', true);
        d3.select(this).classed('active', false);
        removeInfo.call(this, d);
      });

    $('#2018map-text').waypoint(function(direction) {
      if (direction === 'down') {
        hexmap.selectAll('g').remove();
        hexmap
          .append('polygon')
          .attr('points', function(hex) {
            return hex.points;
          })
          .attr('stroke', '#D3D3D3')
          .attr('stroke-width', '1')
          .attr('class', ge14_const_color)
          .on('mouseover', function(d) {
            d3.select(this).classed('ge14_const_color', false);
            d3.select(this).classed('active', true);
            showGE14Info.call(this, d);
          })
          .on('mouseout', function(d) {
            d3.select(this).classed('ge14_const_color', true);
            d3.select(this).classed('active', false);
            removeInfo.call(this, d);
          });

      } else {
        hexmap.selectAll('g').remove();
        hexmap
          .append('polygon')
          .attr('points', function(hex) {
            return hex.points;
          })
          .attr('stroke', '#D3D3D3')
          .attr('stroke-width', '1')
          .attr('class', ge13_const_color)
          .on('mouseover', function(d) {
            d3.select(this).classed('ge13_const_color', false);
            d3.select(this).classed('active', true);
            showGE13Info.call(this, d);
          })
          .on('mouseout', function(d) {
            d3.select(this).classed('ge13_const_color', true);
            d3.select(this).classed('active', false);
            removeInfo.call(this, d);
          });
      }
    }, {
      offset: '40%'
    });

    function ge13_const_color(d) {
      if (d.ge13_win_coallition === 'PR')
        return 'ph';
      else if (d.ge13_win_coallition === 'PAS')
        return 'pas';
      else if (d.ge13_win_coallition === 'BN')
        return 'bn';
      else if (d.ge13_win_coallition === 'SOLIDARITI')
        return 'solidariti';
      else {
        return 'ind';
      }
    }


    function ge14_const_color(d) {
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

    function showGE13Info(d) {

      instruction.text('');

      constituency.text(d.constituency)
      .attr('class', 'constituency');

      state.text('State: ' + d.state)
      .attr('class', 'state');

      coallitionColor.style('opacity', 1)
        .attr('class', ge13_const_color(d));

      winner.text('Winning Party: ' + d.ge13_win_coallition + ' - ' + d.ge13_win_party)
      .attr('class', 'winner');

      majority.text('Majority: ' + d3.format(',')(d.ge13_majority) + ' votes (' + d.ge13_majority_pct + '%)')
      .attr('class', 'majority');
    }

    function showGE14Info(d) {

      instruction.text('');

      constituency.text(d.constituency)
      .attr('class', 'constituency');

      state.text('State: ' + d.state)
      .attr('class', 'state');

      coallitionColor.style('opacity', 1)
        .attr('class', ge14_const_color(d));

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
