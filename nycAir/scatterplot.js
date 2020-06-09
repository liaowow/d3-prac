// import { 
//     select, 
//     csv, 
//     scaleLinear, 
//     max, 
//     scalePoint, 
//     axisLeft, 
//     axisBottom 
// } from 'd3'

const svg = d3.select('svg')
svg.style('background-color', 'cornflowerblue')

const width = parseFloat(svg.attr('width'))
const height = +svg.attr('height')

const render = data => {
  const xValue = d => d.airquality
  const yValue = d => d.date
  const margin = { top: 20, right: 20, bottom: 40, left: 100 }
  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom
  
  const xScale = d3.scaleLinear()
  				.domain([0, d3.max(data, xValue)])
                  .range([0, innerWidth])
                  .nice()
  // console.log(xScale.range())
  
  const yScale = d3.scalePoint()
  				.domain(data.map(yValue))
  				.range([0, innerHeight])
  				.padding(0.5)
  // console.log(yScale.domain())
  
  const yAxis = d3.axisLeft(yScale)
            .tickSize(-innerWidth)
  
  const g = svg.append('g')
  				        .attr('transform', `translate(${margin.left}, ${margin.top})`)
  
  g.append('g').call(yAxis) // same as: yAxis(g.append('g'))
      .selectAll('.domain')
      .remove()
  
  const xAxis = d3.axisBottom(xScale)
          .tickSize(-innerHeight)

  const xAxisG = g.append('g').call(xAxis)
  	.attr('transform', `translate(0, ${innerHeight})`)
  
  xAxisG.select('.domain')
        .remove()

  xAxisG.append('text')
    .attr('y', 30)
    .attr('x', 140)
    .style('fill', 'navy')
    .text('PM2.5 level: the lower the healthier')

  g.selectAll('circle').data(data)
  	.enter().append('circle')
  	.attr('cy', d => yScale(yValue(d)))
  	.attr('cx', d => xScale(xValue(d)))
    .attr('r', 8)
    .style('fill', 'lavender')
    .style('opacity', 0.8)
}

d3.csv('data.csv').then((data) => {
  data.forEach(d => {
  	d.airquality = +d.airquality
  })
	render(data)
})