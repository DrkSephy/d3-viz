// Set the dimensions of the canvas / graph
var margin = {top: 30, right: 20, bottom: 30, left: 50},
    width = 600 - margin.left - margin.right,
    height = 270 - margin.top - margin.bottom;

// Color hash will be used for coloring each line
var color_hash = {  
  0 : ["#ff6961"],
  1 : ['#61a8ff']
} 

// Used for creating the legend
// Colors correspond to the line color order
var legend_hash = {
  0 : ['Commits', "#ff6961"],
  1 : ['Stars', '#61a8ff']
}

// Parse the date / time
var parseDate = d3.time.format("%b %d").parse; 

// Set the ranges
var x = d3.time.scale().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

// Define the axes
var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(5);

var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(5);

// Define the line object
var line = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.count); })
    
// Add the svg canvas
var svg = d3.select("body")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Load our dataset
d3.json('weekly.json', function(err, data) {

  // Parse the dates and counts
  data.forEach(function(d) {
      d.date = parseDate(d.date);
      d.count = d.count;
  });

  // Scale dates and count values
  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain([0, d3.max(data, function(d) { return d.count; })]); 

  // Used to group objects by keys
  var dataNest = d3.nest()
      .key(function(d) {return d.name;})
      .entries(data);

  // For each array of keys (commits, stars, etc), create a line
  dataNest.forEach(function(d) {
    svg.append("path")
      .attr("class", "line")
      .attr("stroke", color_hash[dataNest.indexOf(d)])
      .attr("d", line(d.values));
  });

  // Initialize Tooltip object
  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return '<strong>' + d.name + ':' +  "</strong> <span style='color:white'>" +  d.count + '</span>'
    });

  // Display tooltips
  svg.call(tip);

  // Create circles around all points
  var circles = svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle");

  circles
    .attr("cx", function (d) { return x(d.date) })
    .attr("cy", function (d) { return y(d.count) })
    .attr("r", function (d) { return 5 })
    .style('stroke', '#917394')
    .style("fill", '#ffffff' )
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)


  // Create x-axis
  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  // Create y-axis
  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

  // Initialize legend  
  var legend = svg.append("g")
    .attr("class", "legend")
    .attr("x", 500 - 65)
    .attr("y", 25)
    .attr("height", 100)
    .attr("width", 100);

  // Create the legend
  legend.selectAll('g')
    .data(dataNest)
    .enter()
    .append('g')
    .each(function(d, i) {
      var g = d3.select(this);
      g.append("rect")
        .attr("x", 500 - 65)
        .attr("y", i*25)
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", color_hash[String(i)]);
      
      g.append("text")
        .attr("x", 500 - 50)
        .attr("y", i * 25 + 8)
        .attr("height",30)
        .attr("width",100)
        .style("fill", color_hash[String(i)])
        .text(legend_hash[String(i)][0]);
    });
});