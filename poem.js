// data to be manipulated
let poemVerses = ["Always","in the middle", "of our bloodiest battles", "you lay down your arms","like flowering mines","to conquer me home."];

// D3 Design Pattern
/* 1. create a selection */
let selection = d3.select("#viz")
                  .selectAll("p")

selection
  /* 2. associate data with selection */
  .data(poemVerses)
  .enter()
  /* 3. append elements to the DOM */
  .append("p")
  /* 4. modify elements based on the data */
  .text("Click Me To Reveal Verse")
  .on("click", function(d, i) {
    d3.select(this).text(d)
  })

// targeting green circle
d3.select(".target")
  .style("stroke-width", 7)
  // .style("opacity", 0.5)

/* practicing coordinates */
let coordinates = d3.select("#coordinate")
coordinates.append("circle")
           .attr("cx", 20).attr("cy", 20).attr("r", 20).style("fill", "aqua")
coordinates.append("circle")
           .attr("cx", 140).attr("cy", 150).attr("r", 20).style("fill", "deeppink")
coordinates.append("circle")
           .attr("cx", 280).attr("cy", 50).attr("r", 20).style("fill", "gold")

/* practicing scales and axis */
// select the svg area
const scale = d3.select("#scale")

// create a scale: transform value in pixel
const x = d3.scaleLinear()
            .domain([0, 100]) // This is the min and the max of the data: 0 to 100 if percentages
            .range([0, 400]) // This is the corresponding value I want in Pixel

console.log(x(100))

// Show the axis that corresponds to this scale
scale.call(d3.axisBottom(x))

// Add 3 dots for 0, 50 and 100%
scale.append("circle")
     .attr("cx", x(10))
     .attr("cy", 100)
     .attr("r", 40)
     .style("fill", "blue")

scale.append("circle")
     .attr("cx", x(50))
     .attr("cy", 100)
     .attr("r", 40)
     .style("fill", "red")

scale.append("circle")
     .attr("cx", x(100))
     .attr("cy", 100)
     .attr("r", 40)
     .style("fill", "green")

/* practicing margin and translation */
// set the dimensions and margins of the graph
const margin = {
  top: 10,
  right: 40,
  bottom: 30,
  left: 30
}

const width = 450 - margin.left - margin.right
const height = 400 - margin.top - margin.bottom

// append the svg object to the body of the page
const area = d3.select("#area")
               .append("svg")
               .attr("width", width + margin.left + margin.right)
               .attr("height", height + margin.top + margin.bottom)
               // translate this svg element to leave some margin
               .append("g")
               .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

// X scale and Axis
const xForMargin = d3.scaleLinear()
                     .domain([0, 100]) // This is the min and the max of the data: 0 to 100 if percentages
                     .range([0, width]) // This is the corresponding value I want in Pixel

area.append("g")
    .attr("transform", "translate(0, " + height + ")")
    .call(d3.axisBottom(xForMargin))

// Y scale and Axis
const yForMargin = d3.scaleLinear()
                     .domain([0, 100]) // This is the min and the max of the data: 0 to 100 if percentages
                     .range([height, 0]) // This is the corresponding value I want in Pixel

area.append("g")
    .call(d3.axisLeft(yForMargin))