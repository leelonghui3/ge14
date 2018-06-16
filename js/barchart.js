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

    var div = d3.select('body').append('div')
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
      .range([(height - paddingBottom), 0])
      .padding(0.2);

    // define axes
    var xAxis = d3.axisBottom(xScale)
      .ticks(20);

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

    // add a label for the y axis
    constChart.append('text')
    .attr('x', (width / 2))
    .attr('y', (height - 30))
    .text('Number of voters');

    // credit
    constChart.append('text')
      .attr('y', height - 5)
      .attr('x', padding)
      .text('Source: Malaysian Election Commission (2018), Malaysiakini (2008)');

    // Show seat information
    function showInfo(d) {

      div.html(d.won_coallition)
      .style('opacity', 1)
      .style("left", (d3.event.pageX) + "px")
      .style("top", (d3.event.pageY - 28) + "px");
      // constName.text(d.const_name);
      // state.text(d.State);
      // coallitionColour.style('opacity', 1)
      //   .attr('class', const_color(d));
      // wonCoallition.text(d.won_coallition)
      //   .attr('class', const_color(d));
      // voters.text(d3.format(',')(d.total_voters) + ' voters');
    }

    function removeInfo() {
      // constName.text('');
      // state.text('');
      // coallitionColour.style('opacity', 0);
      // wonCoallition.text('');
      // voters.text('');
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

    // BN seats and transition
    $('#barchart-1').waypoint(function(direction) {
      if (direction === 'down') {
        console.log('Show BN seats');
        bars.transition()
          .duration(2000)
          .attr('width', function(d) {
            if (d.won_coallition === 'Barisan Nasional') {
              return xScale(d.total_voters);
            }
          })
          .ease(d3.easeElastic);
      } else {
        console.log('Hide BN seats');
        bars.transition()
          .duration(1500)
          .attr('width', function(d) {
            if (d.won_coallition === 'Barisan Nasional' && d.const_name != 'Igan') {
              return 0;
            }
          })
          .ease(d3.easeElastic);
      }
    }, {
      offset: '40%'
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
        console.log('Show national and BN line and text');
        nationalmeanLine.transition()
          .duration(1000)
          .attr('y2', (height - paddingBottom));

        nationalText.transition()
          .delay(1000)
          .text('National average: ' + d3.format(',')(nationalmean))
          .style('fill', '#333333');

        BNmeanLine.transition()
          .duration(1000)
          .attr('y2', (height - paddingBottom));

        BNText.transition()
          .delay(1000)
          .text('BN average: ' + d3.format(',')(BNmean))
          .style('fill', '#092781');
      } else {
        console.log('Hide national line and text');
        nationalmeanLine.transition()
          .attr('y2', 0);

        BNmeanLine.transition()
        .attr('y2', 0);

        nationalText.text('');
        BNText.text('');
      }
    }, {
      offset: '40%'
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
        console.log('Show PH seats, line and text, keep BN seats');

        bars.transition()
          .duration(2000)
          .attr('width', function(d) {
            if (d.won_coallition === 'Pakatan Harapan') {
              return xScale(d.total_voters);
            } else if (d.won_coallition === 'Barisan Nasional') {
              return 0;
            }
          })
          .ease(d3.easeElastic);

        PHmeanLine.transition()
          .duration(1000)
          .attr('y2', (height - paddingBottom));

        PHText.transition()
          .delay(1000)
          .attr('x', (xScale(PHmean)) + 5)
          .attr('y', (padding + 170))
          .text('PH average: ' + d3.format(',')(PHmean))
          .style('fill', '#ED1C24');
      } else {
        console.log('Hide PH seats, line and text');
        bars.transition()
          .duration(1500)
          .attr('width', function(d) {
            if (d.won_coallition === 'Pakatan Harapan') {
              return 0;
            } else if (d.won_coallition === 'Barisan Nasional') {
              return xScale(d.total_voters);
            }
          })
          .ease(d3.easeElastic);

        PHmeanLine.transition()
          .attr('y2', 0);

        PHText.text('');
      }
    }, {
      offset: '40%'
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
        console.log('Show PAS and independent seats, PAS line and text');

        bars.transition()
          .duration(2000)
          .attr('width', function(d) {
            if (d.won_coallition === 'PAS' || d.won_coallition === 'Independent' || d.won_coallition === 'Solidariti') {
              return xScale(d.total_voters);
            } else if (d.won_coallition === 'Barisan Nasional' || d.won_coallition === 'Pakatan Harapan') {
              return 0;
            }
          })
          .ease(d3.easeElastic);

        PASmeanLine.transition()
          .duration(1000)
          .attr('y2', (height - paddingBottom));

        PASText.transition()
          .delay(1000)
          .text('PAS average: ' + d3.format(',')(PASmean))
          .style('fill', '#009000');
      } else {
        console.log('Hide PAS and independent seats, PAS line and text');

        bars.transition()
          .duration(1500)
          .attr('width', function(d) {
            if (d.won_coallition === 'PAS' || d.won_coallition === 'Independent' || d.won_coallition === 'Solidariti') {
              return 0;
            } else if (d.won_coallition === 'Pakatan Harapan') {
              return xScale(d.total_voters);
            }
          })
          .ease(d3.easeElastic);

        PASmeanLine.transition()
          .attr('y2', 0);

        PASText.text('');
      }
    }, {
      offset: '40%'
    });

    $('#barchart-5').waypoint(function (direction) {
      if (direction === 'down') {
        bars.transition()
        .duration(2000)
        .attr('width', function(d) {
          if(d.won_coallition === 'Barisan Nasional' || d.won_coallition === 'Pakatan Harapan') {
            return xScale(d.total_voters);
          } else if (d.won_coallition === 'PAS' || d.won_coallition === 'Independent' || d.won_coallition === 'Solidariti') {
            return xScale(d.total_voters);
          }
        })
        .ease(d3.easeElastic);
      } else {
        bars.transition()
        .duration(1500)
        .attr('width', function(d) {
          if(d.won_coallition === 'Barisan Nasional' || d.won_coallition === 'Pakatan Harapan') {
            return 0;
        } else if (d.won_coallition === 'PAS' || d.won_coallition === 'Independent' || d.won_coallition === 'Solidariti') {
          return xScale(d.total_voters);
        }
      })
      .ease(d3.easeElastic);
    }}, {
      offset: '40%'
    });

  });
});
