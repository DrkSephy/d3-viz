var dataFile = '../fbDataMarchTotal/fbTotal.json';
var names = ["CommitCommentEvent", "ForkEvent", "WatchEvent", "PullRequestEvent", "PullRequestReviewCommentEvent", "IssuesEvent", "IssueCommentEvent",  "PushEvent"];
var left_width = 100;

d3.json(dataFile, function(err, data) {
  var max = d3.max(data, function(d) { return d.count });
  var min = d3.min(data, function(d) { return d.count });

  // Create tooltip
  var text = d3.select('body').append('div').attr('class', 'text-tooltip');
  
  var linScale = d3.scale.log()
    .domain([min, max])
    .range([250, 700]);


  var chart = d3.select('.chart')
    .selectAll('div')
      .data(data)
    .enter().append('div')
      .style('width', function(d) { return  linScale(d.count) + 'px' })
      .text(function(d) { return d.name })
      .on('mouseover', function(d) {
        text.style('display', 'block')
        .html('Event: ' + d.name + 
              '<br>' + 'Count: ' + d.count)
      })
      .on('mousemove', function (d) {
        return text.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
      })
      .on('mouseout', function() {
        return text.style('display', 'none');
      });
});