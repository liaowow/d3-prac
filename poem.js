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
  .style("opacity", 0.5)

// practicing coordinates