$(document).ready(function() {

  d3.csv('data/const_difference.csv', function(error, data) {

    if (error) {
      throw error;
    }

    var width = 850;
    var height = 500;
    padding = 20;

    var constChart = d3.select('#const_chart').append('svg')
      .attr('width', width)
      .attr('height', height);

    var div = d3.select('#const_chart').append('div')
      .attr('class', 'chart-tooltip')
      .style('opacity', 0);

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
      .rangeRound([(height - padding), padding])
      .padding(0.28);

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
      .attr('y', function(d) {
        return yScale(d.const_name);
      })
      .attr('width', 0)
      .attr('height', yScale.bandwidth())
      .attr('class', const_color);

    // tooltip
    bars.on('mouseover', function(d) {
        div.style('opacity', 0.9);
        div.html('<strong><span font-family = "Varela Round">' + d.const_name + '</span></strong><br>' +
            '<span class = "state">' + d.State + '</span><br>' +
            '<span class = "state">' + d.won_coallition + '</span><br>' +
            '<span class = "losers">Voters: ' + '<strong>' + d.voters + '</strong></span>')
          .style('left', (d3.event.pageX) + 'px')
          .style('top', (d3.event.pageY - 28) + 'px');
        d3.select(this).classed('active', true);
        d3.select(this).classed('const_color', false);
      })
      .on('mouseout', function(d) {
        div.style('opacity', 0);
        d3.select(this).classed('active', false);
        d3.select(this).classed('const_color', true);
      });

    // transition
    bars.transition()
      .duration(1500)
      .delay(3000)
      .attr('width', function(d) {
        return xScale(d.total_voters);
      })
      .ease(d3.easeElastic);

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

    // National mean dashed line and transition
    var nationalmeanLine = constChart.append('line')
      .attr('x1', xScale(nationalmean))
      .attr('x2', xScale(nationalmean))
      .attr('y1', padding)
      .attr('y2', padding)
      .style('stroke', '#D3D')
      .style('stroke-dasharray', '3, 3');

      nationalmeanLine.transition()
      .duration(1000)
      .attr('y2', (height - padding))
      .delay(4500);

    constChart.append('text')
      .transition()
      .delay(5500)
      .attr('x', (xScale(nationalmean)) + 5)
      .attr('y', (padding + 100))
      .text('National average: ' + d3.format(',')(nationalmean))
      .style('fill', '#D3D');

    // PH mean dashed line and transition
    var PHmeanLine = constChart.append('line')
      .attr('x1', xScale(PHmean))
      .attr('x2', xScale(PHmean))
      .attr('y1', padding)
      .attr('y2', padding)
      .style('stroke', '#ED1C24')
      .style('stroke-dasharray', '3, 3');

      PHmeanLine.transition()
      .duration(1000)
      .attr('y2', (height - padding))
      .delay(8500);

    constChart.append('text')
    .transition()
    .delay(9500)
      .attr('x', (xScale(PHmean)) + 5)
      .attr('y', (padding + 170))
      .text('PH average: ' + d3.format(',')(PHmean))
      .style('fill', '#ED1C24');

    // BN mean dashed line and transition
    var BNmeanLine = constChart.append('line')
      .attr('x1', xScale(BNmean))
      .attr('x2', xScale(BNmean))
      .attr('y1', padding)
      .attr('y2', padding)
      .style('stroke', '#092781')
      .style('stroke-dasharray', '3, 3');

      BNmeanLine.transition()
      .duration(1000)
      .attr('y2', (height - padding))
      .delay(6500);

    constChart.append('text')
      .transition()
      .delay(7500)
      .attr('x', (xScale(BNmean)) + 5)
      .attr('y', (padding + 30))
      .text('BN average: ' + d3.format(',')(BNmean))
      .style('fill', '#092781');

    // PAS mean dashed line and transition
    var PASmeanLine = constChart.append('line')
      .attr('x1', xScale(PASmean))
      .attr('x2', xScale(PASmean))
      .attr('y1', padding)
      .attr('y2', padding)
      .attr('stroke', '#009000')
      .style('stroke-dasharray', '3, 3');

      PASmeanLine.transition()
      .duration(1000)
      .attr('y2', (height - padding))
      .delay(10500);

    constChart.append('text')
    .transition()
    .delay(11500)
      .attr('x', (xScale(PASmean)) + 5)
      .attr('y', (padding + 240))
      .text('PAS average: ' + d3.format(',')(PASmean))
      .style('fill', '#009000');

    // // add a label for the y axis
    // constChart.append('text')
    //   .attr("class", 'xAxis_label')
    //   .attr('text-anchor', 'middle')
    //   .attr('y', (height))
    //   .attr('x', (width / 2))
    //   .text('Number of Voters');

    // legend
    var size = 200;
    var legend_coallition = ['Pakatan Harapan', 'Barisan Nasional', 'PAS', 'Solidariti', 'Independent'];
    var legend = constChart.append('svg')
      .attr('width', 200)
      .attr('height', (size * 2))
      .attr('x', (width - padding - size))
      .attr('y', padding)
      .selectAll('g')
      .data(legend_coallition)
      .enter()
      .append('g')
      .attr('transform', function(d, i) {
        return "translate(0," + i * 40 + ")";
      });

    legend.append('rect')
      .attr('width', 36)
      .attr('height', 36)
      .attr('class', function(d) {
        if (d === 'Pakatan Harapan') {
          return 'ph';
        } else if (d === 'PAS') {
          return 'pas';
        } else if (d === 'Barisan Nasional') {
          return 'bn';
        } else if (d === 'Independent') {
          return 'ind';
        } else {
          return 'solidariti';
        }
      });

    legend.append('text')
      .attr('x', 40)
      .attr('y', 15)
      .attr('dy', '0.5em')
      .attr('text-anchor', 'start')
      .attr('class', 'legend')
      .text(function(d) {
        return d;
      });

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

  });

});
