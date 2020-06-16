// import { select, arc } from 'd3'

const svg = d3.select('svg')
svg.style('background-color', 'lightblue')

const width = svg.attr('width')
const height = svg.attr('height')
const colorScale = d3.scaleOrdinal()
        .domain(['apple', 'lemon'])
        .range(['#c11d1d', '#eae600'])
const radiusScale = d3.scaleOrdinal()
        .domain(['apple', 'lemon'])
        .range([50, 30])

// rendering logic
const render = (selection, { fruits }) => {
    const circles = selection.selectAll('circle').data(fruits)

    circles
    .enter().append('circle')
        .attr('cx', (d, i) => i * 150 + 180)
        .attr('cy', height / 2)
        .attr('r', d => radiusScale(d.type))
        .attr('fill', d => colorScale(d.type))
    circles
        .attr('r', d => radiusScale(d.type))
        .attr('fill', d => colorScale(d.type))
    circles
    .exit().remove()
}

// state manipulation logic
const makeFruit = type => ({ type })
const fruits = d3.range(5)
        .map(() => makeFruit('apple'))

render(svg, { fruits })

/* eating an apple for 1 sec! */
setTimeout(() => {
    fruits.pop()
    render(svg, { fruits })
}, 1000)

/* replacing an apple with a lemon! */
setTimeout(() => {
    fruits[2].type = 'lemon'
    render(svg, { fruits })
}, 2000)