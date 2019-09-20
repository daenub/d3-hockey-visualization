var svg = d3.select("#scatter"),
    margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = +svg.attr("width"),
    height = +svg.attr("height"),
    domainwidth = width - margin.left - margin.right,
    domainheight = height - margin.top - margin.bottom,
    TEAM_NAMES = [
      {name: "SCB", color: "#60B19C"},
      {name: "HCD", color: "#8EC9DC"},
      {name: "HCAP", color: "#D06B47"},
      {name: "EVZ", color: "#A72D73"},
    ];


var tooltip = d3.select(".tooltip");

var x = d3.scaleLinear()
    .domain(padExtent([160,205]))
    .range(padExtent([0, domainwidth]));
var y = d3.scaleLinear()
    .domain(padExtent([60,110]))
    .range(padExtent([domainheight, 0]));

var g = svg.append("g")
    .attr("transform", "translate(" + margin.top + "," + margin.top + ")");

g.append("rect")
    .attr("width", width - margin.left - margin.right)
    .attr("height", height - margin.top - margin.bottom)
    .attr("fill", "#F6F6F6");

Promise.all([
  d3.json("data/players_scb.json"),
  d3.json("data/players_davos.json"),
  d3.json("data/players_hc-ambri-piotta.json"),
  d3.json("data/players_zug.json"),
]).then(function(data) {
  const players = data.reduce(function(acc, team, index) {
    return acc.concat(team.map(function(player) {
      player.team = index
      return player
    }))
  }, [])

  console.log(g.selectAll("circle"), g.selectAll("path"))

  g.selectAll("circle")
      .data(players)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("r", 7)
      .attr("cx", function(d) { return x(d.height); })
      .attr("cy", function(d) { return y(d.weight); })
      .style("fill", d => TEAM_NAMES[d.team].color)
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseout", mouseout);

  function mouseover(d) {
      d3.select(this)
        .attr("stroke", "black")

      tooltip.html("Team: " + TEAM_NAMES[d.team].name +"<br>Name: " + d.name  + ".<br> Weight: " + d.weight + "<br> Height: " + d.height);
      tooltip.style("visibility", "visible");
      tooltip.style("background-color", TEAM_NAMES[d.team].color);
  }

  function mousemove() {
      return tooltip
          .style("top", (event.pageY-10)+"px")
          .style("left",(event.pageX+10)+"px");
  }

  function mouseout(d) {
      d3.select(this)
        .attr("stroke", "none")
      tooltip.style("visibility", "hidden");
  }

  g.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + y.range()[0] + ")")
      .call(d3.axisBottom(x).ticks(15));

  g.append("g")
      .attr("class", "y axis")
      .call(d3.axisLeft(y).ticks(15));

  const legend = g.append("g")
                    .attr("transform", "translate(20,450)")

  TEAM_NAMES.forEach((team, index) => {
    legend.append("circle")
      .attr("r", 10)
      .attr("cy", 25 * index)
      .attr("fill", team.color)

    legend.append("text")
      .text(team.name)
      .attr("x", 15)
      .attr("y", 25 * index)
      .attr("alignment-baseline", "central")
  })
});

function padExtent(e, p) {
  if (p === undefined) p = 1;
  return ([e[0] - p, e[1] + p]);
}