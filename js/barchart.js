$(document).ready(function() {

  d3.csv('data/const_difference.csv', function(error, data) {

    if (error) {
      throw error;
    }

    var width = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) * 0.8;
    var height = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) * 0.7;
    padding = 20;

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

      // to register multiple listeners for same event type,
      // you need to add namespace, i.e., 'click.foo'
      // necessary if you call invoke this function for multiple svgs
      // api docs: https://github.com/mbostock/d3/wiki/Selections#on
      d3.select(window).on("resize." + container.attr("id"), resize);

      // get width of container and resize svg to fit it
      function resize() {
        var targetWidth = parseInt(container.style("width"));
        svg.attr("width", targetWidth);
        svg.attr("height", Math.round(targetWidth / aspect));
      }
    }

    var div = d3.select('#const_chart').append('div')
      .attr('class', 'chart-tooltip')
      .style('opacity', 0);

    var infoBox = constChart.append('svg')
      .attr('width', 200)
      .attr('height', 400)
      .attr('x', (width - padding - 200))
      .attr('y', padding);

    var constName = infoBox.append('text')
      .attr('x', 0)
      .attr('y', 30)
      .text('');

    var state = infoBox.append('text')
      .attr('x', 0)
      .attr('y', 60)
      .text('')
      .text('');

    var coallitionColour = infoBox.append('rect')
      .attr('width', 35)
      .attr('height', 35)
      .attr('x', 0)
      .attr('y', 70)
      .style('opacity', '0');

    var wonCoallition = infoBox.append('text')
      .attr('x', 40)
      .attr('y', 93)
      .text('');

    var voters = infoBox.append('text')
      .attr('x', 0)
      .attr('y', 130)
      .text('');

    // clean data
    data.forEach(function(d) {
      d.const_name = d.const_name;
      d.won_coallition = d.won_coallition;
      d.winlose = d.winlose;
      d.total_voters = +d.total_voters;
      d.voters = d.voters;
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
      .range([(height - padding), padding])
      .padding(0.2);

    // define axes
    var xAxis = d3.axisBottom(xScale)
      .ticks(20);

    var yAxis = d3.axisLeft(yScale);

    constChart.append('g')
      .attr('transform', 'translate(0,' + (height - padding) + ')')
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

    // tooltip
    bars.on('mouseover', function(d) {
        showInfo.call(this, d);
        d3.select(this).classed('active', true);
        d3.select(this).classed('const_color', false);
      })
      .on('mouseout', function(d) {
        removeInfo();
        div.style('opacity', 0);
        d3.select(this).classed('active', false);
        d3.select(this).classed('const_color', true);
      });

    // // add a label for the y axis
    // constChart.append('text')
    //   .attr("class", 'xAxis_label')
    //   .attr('text-anchor', 'middle')
    //   .attr('y', (height))
    //   .attr('x', (width / 2))
    //   .text('Number of Voters');

    // Show seat information
    function showInfo(d) {
      constName.text(d.const_name);
      state.text(d.State);
      coallitionColour.style('opacity', 1)
        .attr('class', const_color(d));
      wonCoallition.text(d.won_coallition)
        .attr('class', const_color(d));
      voters.text(d3.format(',')(d.total_voters) + ' voters');
    }

    function removeInfo() {
      constName.text('');
      state.text('');
      coallitionColour.style('opacity', 0);
      wonCoallition.text('');
      voters.text('');
    }

    // render color for each bar
    function const_color(d) {
      if (d.won_coallition === 'Pakatan Harapan') {
        return 'ph';
      } else if (d.won_coallition === 'PAS') {
        return 'pas';
      } else if (d.won_coallition === 'Barisan Nasional') {
        return 'bn';
      } else if (d.won_coallition === 'Independent') {
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
      if (d.won_coallition === 'Pakatan Harapan') {
        return d.total_voters;
      }
    });

    var BNmean = d3.mean(data, function(d) {
      if (d.won_coallition === 'Barisan Nasional') {
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
    // PHmean = d3.format(',')(PHmean);
    console.log('National: ' + nationalmean);
    console.log('PH: ' + PHmean);
    console.log('BN: ' + BNmean);
    console.log('PAS: ' + PASmean);

    // transition
    // $('#showChart').waypoint(function(direction) {
    //   if (direction === 'down') {
    //     console.log('show chart');
    //     $('#constChart').removeClass('.constChart-wrapper').addClass('uk-position-fixed uk-position-bottom-center');
    //   } else {
    //     console.log('hide chart');
    //     $('#constChart').removeClass('uk-position-fixed uk-position-bottom-center').addClass('.constChart-wrapper');
    //   }
    // }, {
    //   offset: 0
    // });

    // Show biggest and smallest Seats
    $('#barchart-1').waypoint(function(direction) {
      if (direction === 'down') {
        bars.transition()
          .duration(2000)
          .attr('width', function(d) {
            if (d.const_name === 'Igan' || d.const_name === 'Bangi') {
              return xScale(d.total_voters);
            }
          })
          .ease(d3.easeElastic);
      } else {
        bars.transition()
          .duration(500)
          .attr('width', 0);
      }
    }, {
      offset: '10%'
    });

    // BN seats and transition
    $('#barchart-2').waypoint(function(direction) {
      if (direction === 'down') {
        console.log('Show BN seats');
        bars.transition()
          .duration(2000)
          .attr('width', function(d) {
            if (d.won_coallition === 'Barisan Nasional') {
              return xScale(d.total_voters);
            } else if (d.const_name === 'Bangi') {
              return 0;
            }
          })
          .ease(d3.easeElastic);
      } else {
        console.log('Hide BN seats');
        bars.transition()
          .duration(500)
          .attr('width', function(d) {
            if (d.won_coallition === 'Barisan Nasional' && d.const_name != 'Igan') {
              return 0;
            } else if (d.const_name === 'Igan' || d.const_name === 'Bangi') {
              return xScale(d.total_voters);
            }
          });
      }
    }, {
      offset: '50%'
    });

    // National and BN mean dashed line and transition
    var nationalmeanLine = constChart.append('line')
      .attr('x1', xScale(nationalmean))
      .attr('x2', xScale(nationalmean))
      .attr('y1', padding)
      .attr('y2', padding)
      .style('stroke', '#D3D')
      .style('stroke-dasharray', '3, 3');

    var nationalText = constChart.append('text')
      .attr('x', (xScale(nationalmean)) + 5)
      .attr('y', (padding + 100));

    var BNmeanLine = constChart.append('line')
      .attr('x1', xScale(BNmean))
      .attr('x2', xScale(BNmean))
      .attr('y1', padding)
      .attr('y2', padding)
      .style('stroke', '#092781')
      .style('stroke-dasharray', '3, 3');

    var BNText = constChart.append('text')
      .attr('x', (xScale(BNmean)) + 5)
      .attr('y', (padding + 30));

    $('#barchart-3').waypoint(function(direction) {
      if (direction === 'down') {
        console.log('Show national and BN line and text');
        nationalmeanLine.transition()
          .duration(1000)
          .attr('y2', (height - padding));

        nationalText.transition()
          .delay(1000)
          .text('National average: ' + d3.format(',')(nationalmean))
          .style('fill', '#D3D');

        BNmeanLine.transition()
          .duration(1000)
          .attr('y2', (height - padding));

        BNText.transition()
          .delay(1000)
          .text('BN average: ' + d3.format(',')(BNmean))
          .style('fill', '#092781');
      } else {
        console.log('Hide national line and text');
        nationalmeanLine.transition()
          .attr('y2', padding);

        nationalText.text('');
      }
    }, {
      offset: '50%'
    });



    $('#barchart-3').waypoint(function(direction) {
      if (direction === 'down') {
        console.log('Show BN line and text');

        BNmeanLine.transition()
          .duration(1000)
          .attr('y2', (height - padding));

        BNText.transition()
          .delay(1000)
          .text('BN average: ' + d3.format(',')(BNmean))
          .style('fill', '#092781');
      } else {
        console.log('Hide BN line and text');
        BNmeanLine.transition()
          .attr('y2', padding);

        BNText.text('');
      }
    }, {
      offset: '50%'
    });

    // PH mean dashed line and transition
    var PHmeanLine = constChart.append('line')
      .attr('x1', xScale(PHmean))
      .attr('x2', xScale(PHmean))
      .attr('y1', padding)
      .attr('y2', padding)
      .style('stroke', '#ED1C24')
      .style('stroke-dasharray', '3, 3');

    var PHText = constChart.append('text')
      .attr('x', (xScale(PHmean)) + 5)
      .attr('y', (padding + 170));

    $('#barchart-4').waypoint(function(direction) {
      if (direction === 'down') {
        console.log('Show PH seats, line and text, keep BN seats');

        bars.transition()
          .duration(2000)
          .attr('width', function(d) {
            if (d.won_coallition === 'Pakatan Harapan') {
              return xScale(d.total_voters);
            } else if (d.won_coallition === 'Barisan Nasional') {
              return xScale(d.total_voters);
            }
          })
          .ease(d3.easeElastic);

        PHmeanLine.transition()
          .duration(1000)
          .attr('y2', (height - padding));

        PHText.transition()
          .delay(1000)
          .attr('x', (xScale(PHmean)) + 5)
          .attr('y', (padding + 170))
          .text('PH average: ' + d3.format(',')(PHmean))
          .style('fill', '#ED1C24');
      } else {
        console.log('Hide PH seats, line and text');
        bars.transition()
          .duration(500)
          .attr('width', function(d) {
            if (d.won_coallition === 'Pakatan Harapan') {
              return 0;
            } else if (d.won_coallition === 'Barisan Nasional') {
              return xScale(d.total_voters);
            }
          });

        PHmeanLine.transition()
          .attr('y2', padding);

        PHText.text('');
      }
    }, {
      offset: '50%'
    });

    // PAS and others' mean dashed line and transition
    var PASmeanLine = constChart.append('line')
      .attr('x1', xScale(PASmean))
      .attr('x2', xScale(PASmean))
      .attr('y1', padding)
      .attr('y2', padding)
      .attr('stroke', '#009000')
      .style('stroke-dasharray', '3, 3');

    var PASText = constChart.append('text')
      .attr('x', (xScale(PASmean)) + 5)
      .attr('y', (padding + 240));

    $('#barchart-5').waypoint(function(direction) {

      if (direction === 'down') {
        console.log('Show PAS and independent seats, PAS line and text');

        bars.transition()
          .duration(2000)
          .attr('width', function(d) {
            if (d.won_coallition === 'PAS' || d.won_coallition === 'Independent' || d.won_coallition === 'Solidariti') {
              return xScale(d.total_voters);
            } else if (d.won_coallition === 'Barisan Nasional' || d.won_coallition === 'Pakatan Harapan') {
              return xScale(d.total_voters);
            }
          })
          .ease(d3.easeElastic);

        PASmeanLine.transition()
          .duration(1000)
          .attr('y2', (height - padding));

        PASText.transition()
          .delay(1000)
          .text('PAS average: ' + d3.format(',')(PASmean))
          .style('fill', '#009000');
      } else {
        console.log('Hide PAS and independent seats, PAS line and text');

        bars.transition()
          .duration(500)
          .attr('width', function(d) {
            if (d.won_coallition === 'PAS' || d.won_coallition === 'Independent' || d.won_coallition === 'Solidariti') {
              return 0;
            } else if (d.won_coallition === 'Pakatan Harapan' || d.won_coallition === 'Barisan Nasional') {
              return xScale(d.total_voters);
            }
          });

        PASmeanLine.transition()
          .attr('y2', padding);

        PASText.text('');
      }
    }, {
      offset: '50%'
    });


    // $('#constChart-text-wrapper').waypoint(function(direction) {
    //   if (direction === 'down') {
    //     $('#constChart').removeClass('uk-position-fixed').addClass('uk-position-absolute');
    //   } else {
    //     console.log('isnotbottom');
    //     $('#constChart').removeClass('uk-position-absolute').addClass('uk-position-fixed');
    //   }
    // }, {
    //   offset: 'bottom-in-view'
    // });

  });
});
