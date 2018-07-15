$(document).ready(function() {

  d3.csv('data/const_difference.csv', function(error, data) {

    if (error) {
      throw error;
    }

    var width = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) * 0.8;
    var height = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) * 0.7;
    var padding = 20;
    var paddingBottom = 70;

    var constChart = d3.select('#const_chart').append('svg')
      .attr('width', width)
      .attr('height', height)
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

    // Define the div for the tooltip
    var div = d3.select('body').append('div')
      .attr('class', 'chart-tooltip')
      .style('display', 'none');
    // .style('opacity', 0);

    // clean data
    data.forEach(function(d) {
      d.const_name = d.const_name;
      d.won_coallition = d.won_coallition;
      d.winlose = d.winlose;
      d.total_voters = +d.total_voters;
      d.voters = +d.voters;
    });

    // sort data
    data.sort(function(a, b) {
      return b.total_voters - a.total_voters;
    });

    // define scale
    var xScale = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) {
        return d.total_voters;
      })])
      .range([padding, (width - padding)]);

    var yScale = d3.scaleBand()
      .domain(data.map(function(d) {
        return d.const_name;
      }))
      .range([(height - paddingBottom), 0])
      .padding(0.2);

    // define axes
    var xAxis = d3.axisBottom(xScale)
      .ticks(5)
      .tickFormat(d3.format('.2s'));

    var yAxis = d3.axisLeft(yScale);

    constChart.append('g')
      .attr('transform', 'translate(0,' + (height - paddingBottom) + ')')
      .call(xAxis);

    constChart.append('g')
      .attr('transform', 'translate(' + padding + ', 0)')
      .attr('class', 'y-axis')
      .call(yAxis)
      .selectAll('text')
      .style('display', 'none');

    // plot bars
    bars = constChart.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', padding)
      .attr('y', function(d, i) {
        return yScale(d.const_name);
      })
      .attr('width', 0)
      .attr('height', yScale.bandwidth())
      .attr('class', const_color);

    // add a label for the x axis
    constChart.append('text')
      .attr('x', (width / 2))
      .attr('y', (height - 30))
      .text('Number of voters')
      .attr('class', 'xAxis_label');

    // Show seat information
    function showInfo(d) {

      div.style('display', 'block');
      div.style('opacity', 0.9);
      div.html('<span class="uk-text-uppercase uk-text-bold">' + d.const_name + '</span><br>' +
          '<span class="uk-text-bold">State: </span>' + d.State + '<br>' +
          '<span class="uk-text-bold">Winning Party: </span>' + d.won_coallition + '<br>' +
          '<span class="uk-text-bold uk-text-warning">' + d3.format(',')(d.total_voters) + '</span> voters')
        .style("left", (d3.event.pageX - 75) + "px")
        .style("top", (d3.event.pageY - 100) + "px");
    }

    function removeInfo(d) {
      div.style('display', 'none');
    }

    // render color for each bar
    function const_color(d) {
      if (d.won_coallition === 'PH') {
        return 'ph';
      } else if (d.won_coallition === 'PAS') {
        return 'pas';
      } else if (d.won_coallition === 'BN') {
        return 'bn';
      } else if (d.won_coallition === 'IND') {
        return 'ind';
      } else {
        return 'solidariti';
      }
    }

    // mean
    var nationalmean = d3.mean(data, function(d) {
      return d.total_voters;
    });

    var PHmean = d3.mean(data, function(d) {
      if (d.won_coallition === 'PH') {
        return d.total_voters;
      }
    });

    var BNmean = d3.mean(data, function(d) {
      if (d.won_coallition === 'BN') {
        return d.total_voters;
      }
    });

    var PASmean = d3.mean(data, function(d) {
      if (d.won_coallition === 'PAS') {
        return d.total_voters;
      }
    });

    nationalmean = d3.format('.0f')(nationalmean);
    PHmean = d3.format('.0f')(PHmean);
    BNmean = d3.format('.0f')(BNmean);
    PASmean = d3.format('.0f')(PASmean);

    // BN seats and transition
    $('#chapter-5').waypoint(function(direction) {
      if (direction === 'down') {

        bars.transition()
          .duration(1000)
          .attr('width', function(d) {
            if (d.won_coallition === 'BN') {
              return xScale(d.total_voters);
            }
          })
          .ease(d3.easeCircle);
      } else {
        bars.transition()
          .duration(1500)
          .attr('width', function(d) {
            if (d.won_coallition === 'BN' && d.const_name != 'Igan') {
              return 0;
            }
          })
          .ease(d3.easeCircle);
      }
    }, {
      offset: function() {
        return -this.element.clientHeight;
      }
    });

    // National and BN mean dashed line and transition
    var nationalmeanLine = constChart.append('line')
      .attr('x1', xScale(nationalmean))
      .attr('x2', xScale(nationalmean))
      .attr('y1', 0)
      .attr('y2', 0)
      .style('stroke', '#333333')
      .style('stroke-dasharray', '3, 3');

    var nationalText = constChart.append('text')
      .attr('x', (xScale(nationalmean)) + 5)
      .attr('y', (padding + 100));

    var BNmeanLine = constChart.append('line')
      .attr('x1', xScale(BNmean))
      .attr('x2', xScale(BNmean))
      .attr('y1', 0)
      .attr('y2', 0)
      .style('stroke', '#092781')
      .style('stroke-dasharray', '3, 3');

    var BNText = constChart.append('text')
      .attr('x', (xScale(BNmean)) + 5)
      .attr('y', (padding + 30));

    $('#barchart-2').waypoint(function(direction) {
      if (direction === 'down') {
        nationalmeanLine.transition()
          .duration(1000)
          .attr('y2', (height - paddingBottom));

        nationalText.transition()
          .delay(1000)
          .text('Nat avg: ' + d3.format(',')(nationalmean))
          .style('fill', '#333333');

        BNmeanLine.transition()
          .duration(1000)
          .attr('y2', (height - paddingBottom));

        BNText.transition()
          .delay(1000)
          .text('BN avg: ' + d3.format(',')(BNmean))
          .style('fill', '#092781');
      } else {
        nationalmeanLine.transition()
          .attr('y2', 0);

        BNmeanLine.transition()
          .attr('y2', 0);

        nationalText.text('');
        BNText.text('');
      }
    }, {
      offset: '50%'
    });

    // PH mean dashed line and transition
    var PHmeanLine = constChart.append('line')
      .attr('x1', xScale(PHmean))
      .attr('x2', xScale(PHmean))
      .attr('y1', 0)
      .attr('y2', 0)
      .style('stroke', '#ED1C24')
      .style('stroke-dasharray', '3, 3');

    var PHText = constChart.append('text')
      .attr('x', (xScale(PHmean)) + 5)
      .attr('y', (padding + 170));

    $('#barchart-3').waypoint(function(direction) {
      if (direction === 'down') {
        bars.transition()
          .duration(1000)
          .attr('width', function(d) {
            if (d.won_coallition === 'PH') {
              return xScale(d.total_voters);
            } else if (d.won_coallition === 'BN') {
              return 0;
            }
          })
          .ease(d3.easeCircle);

        PHmeanLine.transition()
          .duration(1000)
          .attr('y2', (height - paddingBottom));

        PHText.transition()
          .delay(1000)
          .attr('x', (xScale(PHmean)) + 5)
          .attr('y', (padding + 170))
          .text('PH avg: ' + d3.format(',')(PHmean))
          .style('fill', '#ED1C24');
      } else {
        bars.transition()
          .duration(1500)
          .attr('width', function(d) {
            if (d.won_coallition === 'PH') {
              return 0;
            } else if (d.won_coallition === 'BN') {
              return xScale(d.total_voters);
            }
          })
          .ease(d3.easeCircle);

        PHmeanLine.transition()
          .attr('y2', 0);

        PHText.text('');
      }
    }, {
      offset: '50%'
    });

    // PAS and others' mean dashed line and transition
    var PASmeanLine = constChart.append('line')
      .attr('x1', xScale(PASmean))
      .attr('x2', xScale(PASmean))
      .attr('y1', 0)
      .attr('y2', 0)
      .attr('stroke', '#009000')
      .style('stroke-dasharray', '3, 3');

    var PASText = constChart.append('text')
      .attr('x', (xScale(PASmean)) + 5)
      .attr('y', (padding + 240));

    $('#barchart-4').waypoint(function(direction) {

      if (direction === 'down') {
        bars.transition()
          .duration(1000)
          .attr('width', function(d) {
            if (d.won_coallition === 'PAS' || d.won_coallition === 'IND' || d.won_coallition === 'SOLIDARITI') {
              return xScale(d.total_voters);
            } else if (d.won_coallition === 'BN' || d.won_coallition === 'PH') {
              return 0;
            }
          })
          .ease(d3.easeCircle);

        PASmeanLine.transition()
          .duration(1000)
          .attr('y2', (height - paddingBottom));

        PASText.transition()
          .delay(1000)
          .text('PAS avg: ' + d3.format(',')(PASmean))
          .style('fill', '#009000');
      } else {
        bars.transition()
          .duration(1500)
          .attr('width', function(d) {
            if (d.won_coallition === 'PAS' || d.won_coallition === 'IND' || d.won_coallition === 'SOLIDARITI') {
              return 0;
            } else if (d.won_coallition === 'PH') {
              return xScale(d.total_voters);
            }
          })
          .ease(d3.easeCircle);

        PASmeanLine.transition()
          .attr('y2', 0);

        PASText.text('');
      }
    }, {
      offset: '50%'
    });

    $('#barchart-5').waypoint(function(direction) {
      if (direction === 'down') {

        bars.transition()
          .duration(1000)
          .attr('width', function(d) {
            if (d.won_coallition === 'BN' || d.won_coallition === 'PH') {
              return xScale(d.total_voters);
            } else if (d.won_coallition === 'PAS' || d.won_coallition === 'IND' || d.won_coallition === 'SOLIDARITI') {
              return xScale(d.total_voters);
            }
          })
          .ease(d3.easeCircle);

        bars.on('mouseover', function(d) {
            showInfo.call(this, d);
            d3.select(this).classed('active', true);
            d3.select(this).classed('const_color', true);
          })
          .on('mouseout', function(d) {
            removeInfo();
            d3.select(this).classed('active', false);
            d3.select(this).classed('const_color', true);
          });
      } else {

        bars.transition()
          .duration(1500)
          .attr('width', function(d) {
            if (d.won_coallition === 'BN' || d.won_coallition === 'PH') {
              return 0;
            } else if (d.won_coallition === 'PAS' || d.won_coallition === 'IND' || d.won_coallition === 'SOLIDARITI') {
              return xScale(d.total_voters);
            }
          })
          .ease(d3.easeCircle);

        bars.on('mouseover', null);
      }
    }, {
      offset: '50%'
    });

  });
});
