/* D3 Design Pattern: selection -> data -> enter -> append */
let climate_daly_data = [
    {region: "Low-and-middle-income countries of the African Region", deaths: 57},
    {region: "Low-and-middle-income countries of the Americas", deaths: 2},
    {region: "Low-and-middle-income countries of the Eastern Mediterranean Region", deaths: 20},
    {region: "Low-and-middle-income countries of the European Region", deaths: 0.67},
    {region: "Low-and-middle-income countries of the South-East Asia Region", deaths: 58},
    {region: "Low-and-middle-income countries of the Western Pacific Region", deaths: 4},
    {region: "High income countries", deaths: 0.23}
];

// `i` is an integer represents the index of the element that the user is hovering over. Note that this way of accessing children starts counting at 1, not zero.
// `toggle` represents the boolean flag to apply the corresponding CSS class
// The `toggle` element allows us to remove the class styles after the user stops hovering over the elements.
let toggleClass = (i, toggle) => {
    // select both the bar chart and the corresponding legend element with d3...
    // ...by accessing the nth child of both the #legend and #viz elements;
    // use the .classed() method to remove and apply the styles to the corresponding elements.
    d3.select("#viz div:nth-child("+ i +")").classed("highlightBar",toggle);
    d3.select("#legend li:nth-child("+ i +")").classed("highlightText",toggle);
};

/* 1. Select DOM element */
let divSelection = d3.select("#viz")
.selectAll("div")

/* 2. Bind data to selection */
divSelection.data(climate_daly_data)
            .enter()
            .append("div")
            .attr("class", "bar")
            .style("width", function(d) {
                return d.deaths * 8 + "px"
            })
            .on("mouseover", function(d, i) {
                toggleClass(i + 1, true)
            })
            .on("mouseout", function(d, i) {
                toggleClass(i + 1, false)
            })

/* 1. Select DOM element */
let listSelection = d3.select("ol")
                      .selectAll("li")

/* 2. Bind data to selection */
listSelection.data(climate_daly_data)
             .enter()
             .append("li")
             .text((d) => {
                return d.region + ": " + d.deaths
             })
             .on("mouseover", function(d, i) {
                toggleClass(i + 1, true)
             })
             .on("mouseout", function(d, i) {
                toggleClass(i + 1, false)
             })

// practice d3-fetch
// const url = "https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/862592/"

// d3.json(url)
// .then(res => {
//     alert(`Current temperature: ${
//     res.consolidated_weather[0].the_temp
//     }°C`)
// })
// .catch(() => {
//     alert("Oh no, something horrible happened!")
// })

// practice drawing an arc
const arcGenerator = d3.arc()
    .innerRadius(25)
    .outerRadius(40)
    .startAngle(0)
    .endAngle(5.5)
    .padAngle(0)
    .cornerRadius(20)

// const arcPath = arcGenerator()