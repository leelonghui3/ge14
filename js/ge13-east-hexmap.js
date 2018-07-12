// Define the div for the tooltip
var div = d3.select('body').append('div')
  .attr('class', 'map-tooltip')
  .style('display', 'none');
  // .style('opacity', 0);

$(document).ready(function() {

  var margin = {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10
    },
    width = ((window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) * 0.8) - margin.left - margin.right,
    height = ((window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) * 0.55) - margin.top - margin.bottom;

  // Create the svg element
  var mapContainer = d3
    .select('#ge13-east-map')
    .append('svg')
    .attr("width", width)
    .attr("height", height)
    .append('g')
    // .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .call(responsivefy);

  function responsivefy(svg) {
    // get container + svg aspect ratio
    var container = d3.select(svg.node().parentNode),
      width = parseInt(svg.style("width")),
      height = parseInt(svg.style("height")),
      aspect = width / height;

    // add viewBox and preserveAspectRatio properties,
    // and call resize so that svg resizes on inital page load
    svg.attr("viewBox", "0 0 " + width + " " + height)
      .attr("perserveAspectRatio", "xMinYMid")
      .call(resize);

    d3.select(window).on("resize." + container.attr("id"), resize);

    // get width of container and resize svg to fit it
    function resize() {
      var targetWidth = parseInt(container.style("width"));
      svg.attr("width", targetWidth);
      svg.attr("height", Math.round(targetWidth / aspect));
    }
  }
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
        return 'translate(' + hex.x + ',' + hex.y + ')';
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
        showInfo.call(this, d);
        d3.select(this).classed('ge13_const_color', false);
        d3.select(this).classed('active', true);
      })
      .on('mouseout', function(d) {
        removeInfo.call(this, d);
        d3.select(this).classed('ge13_const_color', true);
        d3.select(this).classed('active', false);
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

    function showInfo(d) {
      div.style('display', 'block');
      div.style('opacity', 0.9);
      div.html('<span class="uk-text-bold uk-text-uppercase">' + d.constituency + '</span><br>' +
          '<span class="uk-text-bold">State:</span> ' + d.state + '<br>' +
          '<span class="uk-text-bold">Winning Party: </span>' + d.ge14_win_coallition + '<br>' +
          '<span class="uk-text-bold">Majority: </span>' + d3.format(',')(d.ge14_majority_pct) + ' %')
        .style("left", (d3.event.pageX - 75) + "px")
        .style("top", (d3.event.pageY - 140) + "px");
    }

    function removeInfo(d) {
      div.style('display', 'none');
    }



  });
});
