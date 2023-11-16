import { checkAuth } from "./script.js";

window.onload = () => {
  checkAuth();

  // data *** HARD CODED, NEED TO GET FROM DB
  var data = [
    { date: "2023-09-01", value: 20 },
    { date: "2023-09-03", value: 35 },
    { date: "2023-09-06", value: 45 },
    { date: "2023-09-07", value: 20 },
    { date: "2023-09-08", value: 35 },
    { date: "2023-09-09", value: 45 },
    { date: "2023-09-10", value: 30 },
  ];

  // Set up the SVG canvas dimensions
  //   **** width is hardcoded to 300, couldn't get it to work well
  var margin = { top: 40, right: 30, bottom: 20, left: 30 };
  var width = 300 - margin.left - margin.right;
  var height = 250 - margin.top - margin.bottom;

  // Parse the date data
  var parseDate = d3.timeParse("%Y-%m-%d");

  // Format the data
  data.forEach(function (d) {
    d.date = parseDate(d.date);
  });

  // Create scales for the data
  var xScale = d3
    .scaleTime()
    .domain(
      d3.extent(data, function (d) {
        return d.date;
      })
    )
    .range([0, width]);
  var yScale = d3
    .scaleLinear()
    .domain([
      d3.min(data, function (d) {
        return d.value;
      }),
      d3.max(data, function (d) {
        return d.value;
      }),
    ])
    .range([height, 0]);

  //   var yScale = d3.scaleLinear().domain([0, d3.max(data, function(d) { return d.value; })]).range([height, 0]);

  // Create the line generator without curve interpolation
  var line = d3
    .line()
    .x(function (d) {
      return xScale(d.date);
    })
    .y(function (d) {
      return yScale(d.value);
    });

  // Create the SVG element
  var svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Draw the line without the area underneath
  svg
    .append("path")
    .datum(data)
    .attr("class", "line")
    .attr("d", line)
    .attr("fill", "none")
    .attr("stroke", "white")
    .attr("stroke-width", 2);

  // Add X axis with custom ticks
  var xAxis = d3
    .axisBottom(xScale)
    .tickValues([data[0].date, data[data.length - 1].date])
    .tickFormat(d3.timeFormat("%Y-%m-%d"));

  svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  // Add Y axis only
  svg.append("g").attr("class", "y-axis").call(d3.axisLeft(yScale));

  // FONT
  svg.selectAll(".x-axis text").attr("class", "graph-text");

  svg.selectAll(".y-axis text").attr("class", "graph-text");
};
