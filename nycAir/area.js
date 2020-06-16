const svg = d3.select('svg')
svg.style('background-color', 'dodgerblue')

const width = parseFloat(svg.attr('width'))
const height = +svg.attr('height')

const render = data => {
  const xValue = d => d.date
  const yValue = d => d.airquality
  const xAxisLabel = "Time"
  const yAxisLabel = "PM2.5 Level"
  const margin = { top: 20, right: 25, bottom: 50, left: 100 }
  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom
  
  const xScale = d3.scaleTime()
  				.domain(d3.extent(data, xValue))
                  .range([0, innerWidth])
                //   .nice()
  // console.log(xScale.range())
  
  const yScale = d3.scaleLinear()
  				.domain([0, d3.max(data, yValue)])
  				.range([innerHeight, 0])
  				// .padding(0.5)
  // console.log(yScale.domain())
  
  const g = svg.append('g')
                 .attr('transform', `translate(${margin.left}, ${margin.top})`)  
                  
  const yAxis = d3.axisLeft(yScale)
            .tickSize(-innerWidth)
            .tickPadding(10)
  
  const yAxisG = g.append('g').call(yAxis)
  yAxisG.selectAll('.domain').remove()

  yAxisG.append('text')
        .attr('y', -45)
        .attr('x', - innerHeight / 2)
        .style('fill', 'lavender')
        .attr('transform', 'rotate(270)')
        .attr('text-anchor', 'middle')
        .text(yAxisLabel)
  
  const xAxis = d3.axisBottom(xScale)
          .ticks(6)
          .tickSize(-innerHeight)
          .tickPadding(10)

  const xAxisG = g.append('g').call(xAxis)
  	.attr('transform', `translate(0, ${innerHeight})`)
  
  xAxisG.select('.domain')
        .remove()

  xAxisG.append('text')
    .attr('y', 30)
    .attr('x', 140)
    .text(xAxisLabel)

  const areaGenerator = d3.area()
                .x(d => xScale(xValue(d)))
                .y0(innerHeight)  
  				.y1(d => yScale(yValue(d)))
  				.curve(d3.curveBasis)
   
  g.append('path')
  		.attr('class', 'line-path')
  		.attr('d', areaGenerator(data))

//   g.selectAll('circle').data(data)
//   	.enter().append('circle')
//   	.attr('cy', d => yScale(yValue(d)))
//   	.attr('cx', d => xScale(xValue(d)))
//     .attr('r', 8)
//     .style('fill', 'lavender')
//     .style('opacity', 0.8)
}

d3.csv('data.csv').then((data) => {
  data.forEach(d => {
    d.date = new Date(d.date)
  	d.airquality = +d.airquality
  })
	render(data)
})