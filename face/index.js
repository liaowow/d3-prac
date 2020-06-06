// import { select, arc } from 'd3'

const svg = d3.select('svg')
svg.style('background-color', 'cornflowerblue')

const width = svg.attr('width')
const height = svg.attr('height')

const g = svg
	.append('g')
		.attr('transform', `translate(${width / 2}, ${height / 2})`)

const circle = g
	.append('circle')
    .attr('r', 200)
    .attr('fill', 'yellow')

const eyeRadius = 20
const eyeSpacing = 70
const eyeYOffset = -50
const eyesG = g
	.append('g')
		.attr('transform', `translate(0, ${eyeYOffset})`)

const browWidth = 50
const browHeight = 10
const browYOffset = -50
const browsG = eyesG
	.append('g')
		.attr('transform', `translate(0, ${browYOffset})`);

browsG
    .transition().duration(2000)
      .attr('transform', `translate(0, ${browYOffset - 30})`)
		.transition().duration(2000)
			.attr('transform', `translate(0, ${browYOffset})`)

const leftEye = eyesG
	.append('circle')
    .attr('r', eyeRadius)
    .attr('cx', -eyeSpacing)

const rightEye = eyesG
	.append('circle')
    .attr('r', eyeRadius)
    .attr('cx', eyeSpacing)

const leftBrow = browsG
	.append('rect')
    .attr('x', -eyeSpacing - browWidth / 2)
    .attr('width', browWidth)
    .attr('height', browHeight)

const rightBrow = browsG
	.append('rect')
    .attr('x', eyeSpacing - browWidth / 2)
    .attr('width', browWidth)
    .attr('height', browHeight)

const mouth = g
	.append('path')
    .attr('d', d3.arc()({
      innerRadius: 80,
      outerRadius: 0,
      startAngle: Math.PI / 2,
      endAngle: Math.PI * 3 / 2
    }))