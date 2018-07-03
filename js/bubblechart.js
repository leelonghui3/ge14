$(document).ready(function() {

  d3.csv('data/malay_swing.csv', function(error, data) {

    if (error) {
      throw error;
    }

    var width = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) * 0.8;
    var height = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) * 0.7;
    var padding = 20;
    var paddingBottom = 70;
    var paddingLeft = 50;
    var constName = '';

    var circleChart = d3.select('#circle-chart').append('svg')
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

    data.forEach(function(d) {
      d.par_code = d.par_code;
      d.state = d.state;
      d.ge13_constituency = d.ge13_constituency;
      d.ge14_constituency = d.ge14_constituency;
      d.ge13_win_coallition = d.ge13_win_coallition;
      d.ge13_win_party = d.ge13_win_party;
      d.ge14_win_coallition = d.ge14_win_coallition;
      d.ge14_win_party = d.ge14_win_party;
      d.ge13_majority = +d.ge13_majority;
      d.ge13_majority_pct = +d.ge13_majority_pct;
      d.ge14_majority = +d.ge14_majority;
      d.ge14_majority_pct = +d.ge14_majority_pct;
      d.ge13_malay = +d.ge13_malay;
      d.ge14_malay = +d.ge14_malay;
      d.bn_ge13_vote = +d.bn_ge13_vote;
      d.bn_rede_vote = +d.bn_rede_vote;
      d.bn_ge14_vote = +d.bn_ge14_vote;
      d.bn_ge13_vote_pct = +d.bn_ge13_vote_pct;
      d.bn_rede_vote_pct = +d.bn_rede_vote_pct;
      d.adjusted_rede_diff = +d.adjusted_rede_diff;
      d.bn_ge14_vote_pct = +d.bn_ge14_vote_pct;
      d.swing_vote = +d.swing_vote;
      d.swing_pct = +d.swing_pct;
      d.ge13_total_electorate = +d.ge13_total_electorate;
      d.rede_total_electorate = +d.rede_total_electorate;
      d.ge14_total_electorate = +d.ge14_total_electorate;
      d.ge13_tvv = +d.ge13_tvv;
      d.rede_tvv = +d.rede_tvv;
      d.ge14_tvv = +d.ge14_tvv;
      d.ge13_turnout = +d.ge13_turnout;
      d.ge14_turnout = +d.ge14_turnout;
    });

    var xScale = d3.scaleLinear()
      .domain([50, 100])
      .range([paddingLeft, (width - paddingLeft)]);

    var yScale = d3.scaleLinear()
      .domain([0, 100])
      .range([(height - paddingBottom), padding]);

    var rScale = d3.scaleSqrt()
      .domain([0, d3.max(data, function(d) {
        return d.ge14_total_electorate;
      })])
      .range([0, 25]);

    var xAxis = d3.axisBottom(xScale)
      .ticks(5);

    var yAxis = d3.axisLeft(yScale)
      .ticks(5);

    circleChart.append('g')
      .attr('transform', 'translate(' + 0 + ',' + (height - paddingBottom) + ')')
      .call(xAxis);

    circleChart.append('g')
      .attr('transform', 'translate(' + paddingLeft + ',' + 0 + ')')
      .call(yAxis)
      .attr('class', 'circle-y-axis');

    // Grid
    yGridlines = d3.axisLeft(yScale)
      .ticks(5)
      .tickSize(-width + 100)
      .tickFormat('');

    circleChart.append('g')
      .call(yGridlines)
      .attr('class', 'grid')
      .attr('transform', 'translate(' + paddingLeft + ',' + 0 + ')');

    // x axis label
    circleChart.append('text')
      .attr('x', (width / 2))
      .attr('y', (height - 30))
      .text('Malay voters (%)');

    // y axis label
    circleChart.append('text')
      .attr("text-anchor", "middle")
      .attr('y', 0)
      .attr("dy", "12px")
      .attr("x", -(height / 2))
      .attr("transform", "rotate(-90)")
      .text("BN Popular Vote (%)");

    // infoBox

    var infoBox = circleChart.append('svg')
      .attr('width', 600)
      .attr('height', 400)
      .attr('x', paddingLeft)
      .attr('y', 0);

    var showConstituency = infoBox.append('text')
      .attr('x', 5)
      .attr('y', 15)
      .text('');

    var showInstruction = infoBox.append('text')
      .attr('x', 5)
      .attr('y', 60)
      .text('Mouse over/tab to see details');

    var showGE13 = infoBox.append('text')
      .attr('x', 5)
      .attr('y', 45)
      .text('');

    var showAdjusted = infoBox.append('text')
        .attr('x', 5)
        .attr('y', 75)
        .text('');

    var showGE14 = infoBox.append('text')
      .attr('x', 5)
      .attr('y', 105)
      .text('');

    var showDiff = infoBox.append('text')
      .attr('x', 5)
      .attr('y', 135)
      .text('');

    // footnote
    circleChart.append('text')
      .attr('y', (height - 20))
      .attr('x', padding)
      .text('*Adjusted GE13 result');

    circleChart.append('text')
        .attr('y', (height - 3))
        .attr('x', padding)
        .text('**Difference between GE14 and adjusted GE13 result');

    // Credit
    circleChart.append('text')
      .attr('y', height - 5)
      .attr('x', width)
      .attr('text-anchor', 'end')
      .text('Source: Malaysian Election Commission (2018), Penang Institute (2018)');

    // initial stage
    circles = circleChart.selectAll('.circles')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'bn-circle')
      .attr('cx', function(d) {
        if (d.ge13_malay >= 50) {
          return xScale(d.ge13_malay);
        } else {
          return xScale(-100);
        }
      })
      .attr('cy', function(d) {
        if (d.ge13_malay >= 50) {
          return yScale(d.bn_ge13_vote_pct) + 10;
        } else {
          return yScale(-100);
        }
      })
      .attr('r', function(d) {
        return rScale(d.ge13_total_electorate);
      })
      .style('display', 'none');

    // showInfo
    circles.on('mouseover', function(d) {
        showInfo.call(this, d);
        d3.select(this).classed('active', true);
      })
      .on('mouseout', function(d) {
        removeInfo();
        d3.select(this).classed('active', false);
      });

    function showInfo(d) {

      showInstruction.text('');

      showConstituency.text(d.ge14_constituency + ' (' + d.state + ')');

      showGE13.text('GE13 - ' + 'Malay voters: ' + d.ge13_malay + '%, ' +
        "BN's vote: " + d.bn_ge13_vote_pct + '%');

      showAdjusted.text('GE13* - ' + 'Malay voters: ' + d.ge14_malay + '%, ' +
        "BN's vote: " + d.bn_rede_vote_pct + '%' );

      showGE14.text('GE14 - ' + 'Malay voters: ' + d.ge14_malay + '%, ' +
        "BN's vote: " + d.bn_ge14_vote_pct + '%');

      showDiff.text("BN's vote gain/lost** : " + d.pct_diff + '%');
    }

    function removeInfo() {
      showInstruction.text('Mouse over/tab to see details');
      showConstituency.text('');
      showGE13.text('');
      showAdjusted.text('');
      showGE14.text('');
      showDiff.text('');

    }

    // transition
    $('#circlechart-1').waypoint(function(direction) {
      if (direction === 'down') {
        console.log('show circlechart-1');
        circles.transition()
          .delay(function(d, i) {
            return i * 1;
          })
          .attr('cy', function(d) {
            return yScale(d.bn_ge13_vote_pct);
          })
          .style('opacity', 0.5)
          .style('display', 'inline-block');
      } else {
        console.log('hide circlechart-1');
        circles.transition()
          .attr('cy', function(d) {
            return yScale(d.bn_ge13_vote_pct) + 10;
          })
          .style('display', 'none');
      }
    }, {
      offset: '40%'
    });

    $('#circlechart-2').waypoint(function(direction) {
      if (direction === 'down') {

        circles.transition()
          .attr('cx', function(d) {
            if (d.ge14_malay >= 50) {
              return xScale(d.ge14_malay);
            } else {
              return xScale(-100);
            }
          })
          .attr('cy', function(d) {
            if (d.ge14_malay >= 50) {
              return yScale(d.bn_rede_vote_pct);
            } else {
              return yScale(-100);
            }
          })
          .attr('r', function(d) {
            return rScale(d.rede_total_electorate);
          });
      } else {
        console.log('hide circlechart-2');
        circles.transition()
          .attr('cx', function(d) {
            if (d.ge13_malay >= 50) {
              return xScale(d.ge13_malay);
            } else {
              return xScale(-100);
            }
          })
          .attr('cy', function(d) {
            return yScale(d.bn_ge13_vote_pct);
          })
          .attr('r', function(d) {
            return rScale(d.ge13_total_electorate);
          });
      }
    }, {
      offset: '40%'
    });

    $('#circlechart-3').waypoint(function(direction) {
      if (direction === 'down') {
        console.log('circlechart-3 down');
        circles.transition()
          .attr('cx', function(d) {
            if (d.ge14_malay >= 50) {
              return xScale(d.ge14_malay);
            } else {
              return xScale(-100);
            }
          })
          .attr('cy', function(d) {
            if (d.ge14_malay >= 50) {
              return yScale(d.bn_ge14_vote_pct);
            } else {
              return yScale(-100);
            }
          })
          .attr('r', function(d) {
            return rScale(d.ge14_total_electorate);
          });
      } else {
        console.log('circlechart-3 up');
        circles.transition()
          .attr('cy', function(d) {
            if (d.ge14_malay >= 50) {
              return yScale(d.bn_rede_vote_pct);
            } else {
              return yScale(-100);
            }
          })
          .attr('r', function(d) {
            return rScale(d.rede_total_electorate);
          });
      }
    }, {
      offset: '40%'
    });

    $('#circlechart-4').waypoint(function(direction) {
      if (direction === 'down') {
        circles.transition()
          .attr('class', function(d) {
            if (d.pct_diff > 0) {
              return 'bn-win-circle';
            } else {
              return 'bn-circle';
            }
          })
          .style('opacity', function(d) {
            if (d.pct_diff > 0) {
              return 0.8;
            } else {
              return 0.1;
            }
          });
      } else {
        circles.transition()
          .attr('class', 'bn-circle')
          .style('opacity', 0.5);
      }
    }, {
      offset: '40%'
    });

    $('#circlechart-5').waypoint(function(direction) {
      if (direction === 'down') {
        circles.transition()
          .attr('class', function(d) {
            if (d.par_code === 'P004') {
              return 'ph-win-circle';
            } else {
              return 'bn-circle';
            }
          })
          .style('opacity', function(d) {
            if (d.par_code === 'P004') {
              return 0.8;
            } else {
              return 0.1;
            }
          });
      } else {
        circles.transition()
          .attr('class', function(d) {
            if (d.swing_pct > 0) {
              return 'bn-win-circle';
            } else {
              return 'bn-circle';
            }
          })
          .style('opacity', function(d) {
            if (d.swing_pct > 0) {
              return 0.8;
            } else {
              return 0.1;
            }
          });
      }
    }, {
      offset: '40%'
    });

    $('#circlechart-6').waypoint(function(direction) {
      if (direction === 'down') {
        circles.transition()
          .attr('class', function(d) {
            if (d.state === 'Kedah' && d.swing_pct <= -71.11) {
              return 'ph-win-circle';
            } else {
              return 'bn-circle';
            }
          })
          .style('opacity', function(d) {
            if (d.state === 'Kedah' && d.swing_pct <= -71.11) {
              return 0.8;
            } else {
              return 0.1;
            }
          });
      } else {
        circles.transition()
          .attr('class', function(d) {
            if (d.par_code === 'P004') {
              return 'ph-win-circle';
            } else {
              return 'bn-circle';
            }
          })
          .style('opacity', function(d) {
            if (d.par_code === 'P004') {
              return 0.8;
            } else {
              return 0.1;
            }
          });
      }
    }, {
      offset: '40%'
    });
  });
});
