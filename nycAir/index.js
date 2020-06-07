// import { 
//     select, 
//     csv, 
//     scaleLinear, 
//     max, 
//     scaleBand, 
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
  const margin = { top: 20, right: 20, bottom: 35, left: 100 }
  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom
  
  const xScale = d3.scaleLinear()
  				.domain([0, d3.max(data, xValue)])
  				.range([0, innerWidth])
  // console.log(xScale.range())
  
  const yScale = d3.scaleBand()
  				.domain(data.map(yValue))
  				.range([0, innerHeight])
  				.padding(0.2)
  // console.log(yScale.domain())
  
  const yAxis = d3.axisLeft(yScale)
  
  const g = svg.append('g')
  				.attr('transform', `translate(${margin.left}, ${margin.top})`)
  
  yAxis(g.append('g'))
  /* shorthand: g.append('g').call(yAxis) */
  
  g.append('g').call(d3.axisBottom(xScale))
  	.attr('transform', `translate(0, ${innerHeight})`)
  
  g.selectAll('rect').data(data)
  	.enter().append('rect')
  	.attr('y', d => yScale(yValue(d)))
  	.attr('width', d => xScale(xValue(d)))
    .attr('height', yScale.bandwidth())
  	.style('fill', 'lavender')
}

d3.csv('data.csv').then((data) => {
  data.forEach(d => {
  	d.airquality = +d.airquality
  })
	render(data)
})