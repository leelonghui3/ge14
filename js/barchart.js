// var padding = 40;
var viewportWidth = $(window).width();
var viewportHeight = $(window).height() / 2;
var width = viewportWidth * 0.90;
var height = 500;

// width / 1.85;


var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = width - margin.left - margin.right,
    height = height - margin.top - margin.bottom;

var constChart = d3.select('#const_chart').append('svg')
  .attr('width', width)
  .attr('height', height);


d3.csv("data/const_difference.csv", function(error, data) {

  if (error) console.log(error);

  // define the scales
  var xScale = d3.scaleBand()
    .domain(data.map(function(d) {
      return d.const_name;
    }))
    .rangeRound([0, width])
    .padding(0.1);

  var yScale = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) {
      return d.total_voters;
    })])
    .rangeRound([height, 0]);

  // define the axes
  var xAxis = d3.axisBottom(xScale);

  var yAxis = d3.axisLeft(yScale)
                .ticks(20);

  data.forEach(function(d) {
    d.total_voters = +d.total_voters;
    d.const_name = d.const_name;
    d.won_coallition = d.won_coallition;
  });

  data.sort(function(a, b) {
    return b.total_voters - a.total_voters;
  });

  // plot axes
  constChart.append('g')
    .attr('transform', 'translate(0,' + margin.top + margin.bottom + ')')
    .call(xAxis);

  constChart.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + 0 + ')')
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
        // console.log(d.total_voters);
        return yScale(d.total_voters);
      })
    .attr('width', xScale.bandwidth())
    .attr('height', function(d) {
        return height - yScale(d.total_voters);
      });
});
