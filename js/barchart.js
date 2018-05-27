$(document).ready(function() {

  // var padding = 40;
  // var viewportWidth = $(window).width();
  // var viewportHeight = $(window).height() / 2;
  // var width = viewportWidth * 0.90;
  // var height = width / 1.85;

  // var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  // var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  // viewportWidth * 0.90;
  // width / 1.85;

  var width = 1200;
  var height = 600;
  var padding = 70;

  var constChart = d3.select('#const_chart').append('svg')
    .attr('width', width)
    .attr('height', height);

  var div = d3.select('#const_chart').append('div')
    .attr('class', 'chart-tooltip')
    .style('opacity', 0);

  d3.csv('data/const_difference.csv', function(error, data) {

    if (error) throw error;

    data.forEach(function(d) {
      d.const_name = d.const_name;
      d.won_coallition = d.won_coallition;
      d.winlose = d.winlose;
      d.total_voters = +d.total_voters;
      d.voters = d.voters;
    });

    // function seperator(voters) {
    //   return voters.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    // }

    // define the scales
    var xScale = d3.scaleBand()
      .domain(data.map(function(d) {
        return d.const_name;
      }))
      .rangeRound([padding, width])
      .padding(0.25);

    var yScale = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) {
        return d.total_voters;
      })])
      .rangeRound([(height - padding), padding]);

    // define the axes
    var xAxis = d3.axisBottom(xScale);

    var yAxis = d3.axisLeft(yScale)
      .ticks(15);


    data.sort(function(a, b) {
      return b.total_voters - a.total_voters;
    });

    // plot axes
    constChart.append('g')
      .attr('transform', 'translate(0,' + (height - padding) + ')')
      .call(xAxis)
      .selectAll('text')
      .style('display', 'none')
      .selectAll('tick')
      .style('opacity', 0);

    constChart.append('g')
      .attr('transform', 'translate(' + padding + ',' + 0 + ')')
      .call(yAxis);

    // specify domain

    xScale.domain(data.map(function(d) {
      return d.const_name;
    }));
    yScale.domain([0, d3.max(data, function(d) {
      return d.total_voters;
    })]);


    // draw bars

    constChart.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', function(d) {
        return xScale(d.const_name);
      })
      .attr('y', function(d) {
        return yScale(d.total_voters);
      })
      .attr('width', xScale.bandwidth())
      .attr('height', function(d) {
        return height - yScale(d.total_voters) - padding;
      })
      .attr('class', const_color)
      .on('mouseover', function(d) {
        div.style('opacity', 0.9);
        div.html('<strong><span font-family = "Varela Round">' + d.const_name + '</span></strong><br>' +
            '<span class = "state">' + d.State + '</span><br>' + 
            '<span class = "state">' + d.won_coallition + '</span><br>' +
            '<span class = "losers">Voters: ' + '<strong>' + d.voters + '</strong></span>')
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
        d3.select(this).classed('active', true);
        d3.select(this).classed('const_color', false);
      })
      .on('mouseout', function(d) {
        div.style('opacity', 0);
        d3.select(this).classed('active', false);
        d3.select(this).classed('const_color', true);
      });

    // constChart
    //   .attr('height', 0)
    //   .attr('y', height)
    //   .transition()
    //   .duration(1500)
    //   .delay(function(d, i) {
    //     return i * 10;
    //   });

    // add a label for the y axis
    constChart.append('text')
      .attr("class", 'yAxis_label')
      .attr('text-anchor', 'middle')
      .attr('y', 0)
      .attr('dy', '12px')
      .attr('x', -height / 2)
      .attr('transform', 'rotate(-90)')
      .text('Number of Voters');

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

    var PHmean = 78850;

    constChart.append('text')
         .attr('text-anchor', 'end')
         .attr('x', width)
         .attr('y', height - 30)
         .attr('class', 'credit')
         .text('Source: Malaysian Election Commission (2018)');

    // d3.mean(data, function(d) {
    //   if(d.won_coallition === 'Pakatan Harapan') {
    //     return d.total_voters;
    //   }
    // });

    // PHmean = d3.format('.0f')(PHmean);
    // PHmean = d3.format(',')(PHmean);
    console.log(PHmean);

    // constChart.append('path')
    //   .attr('x1', padding)
    //   .attr("x2", width)
    //   .attr("y1", function(PHmean) { return yScale(PHmean) })
    //   .attr("y2", function(PHmean) { return yScale(PHmean) })
    //   .attr("stroke-width", 6)
    //   .attr("stroke", "black")
    //   .attr("stroke-dasharray", "8,8");
  });


});
