// import { 
//     select, 
//     csv, 
//     scaleLinear, 
//     extent, 
//     axisLeft, 
//     axisBottom 
// } from 'd3'

const svg = d3.select('svg')
svg.style('background-color', 'crimson')

const width = parseFloat(svg.attr('width'))
const height = +svg.attr('height')

const render = data => {
  const xValue = d => d.horsepower
  const yValue = d => d.weight
  const xAxisLabel = "Horsepower"
  const yAxisLabel = "Weight"
  const margin = { top: 20, right: 30, bottom: 60, left: 90 }
  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom
  
  const xScale = d3.scaleLinear()
  				.domain(d3.extent(data, xValue))
                  .range([0, innerWidth])
                  .nice()
  // console.log(xScale.range())
  
  const yScale = d3.scaleLinear()
  				.domain(d3.extent(data, yValue))
  				  .range([0, innerHeight])
  				  .nice()
  // console.log(yScale.domain())
  
  const yAxis = d3.axisLeft(yScale)
            .tickSize(-innerWidth)
            .tickPadding(10)
  
  const g = svg.append('g')
  				    .attr('transform', `translate(${margin.left}, ${margin.top})`)
  
  const yAxisG = g.append('g').call(yAxis) // same as: yAxis(g.append('g'))
  yAxisG.selectAll('.domain').remove()
  
  yAxisG.append('text')
    .attr('y', -70)
    .attr('x', - innerHeight / 2)
    .style('fill', 'lavender')
    .attr('transform', `rotate(270)`)
    .attr('text-anchor', 'middle')
    .text(yAxisLabel)

  const xAxis = d3.axisBottom(xScale)
          .tickSize(-innerHeight)
          .tickPadding(10)

  const xAxisG = g.append('g').call(xAxis)
                    .attr('transform', `translate(0, ${innerHeight})`)
  xAxisG.select('.domain').remove()

  xAxisG.append('text')
    .attr('y', 45)
    .attr('x', innerWidth / 2)
    .style('fill', 'lavender')
    .text(xAxisLabel)

  g.selectAll('circle').data(data)
  	.enter().append('circle')
  	.attr('cy', d => yScale(yValue(d)))
  	.attr('cx', d => xScale(xValue(d)))
    .attr('r', 8)
    .style('fill', 'lavender')
    .style('opacity', 0.8)
}

d3.csv('https://vizhub.com/curran/datasets/auto-mpg.csv')
    .then((data) => {
        data.forEach(d => {
            d.mpg = +d.mpg
            d.cylinders = +d.cylinders
            d.displacement = +d.displacement
            d.horsepower = +d.horsepower
            d.weight = +d.weight
            d.acceleration = +d.acceleration
            d.year = +d.year
        })
        render(data)
    })