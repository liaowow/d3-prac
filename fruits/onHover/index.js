// import { select, arc } from 'd3'

const svg = d3.select('svg')    
    .style('background-color', 'lightblue')

const width = svg.attr('width')
const height = svg.attr('height')
const colorScale = d3.scaleOrdinal()
        .domain(['apple', 'lemon'])
        .range(['#c11d1d', '#eae600'])
const radiusScale = d3.scaleOrdinal()
        .domain(['apple', 'lemon'])
        .range([50, 30])
const xPosition = (d, i) => i * 150 + 180

// state manipulation logic
const makeFruit = type => ({ 
    type,
    id: Math.random()
})

let fruits = d3.range(5).map(() => makeFruit('apple'))
let selectedFruit = null

const setSelectedFruit = id => {
    selectedFruit = id,
    render(svg, { fruits })
}

// rendering logic
const render = (selection, { fruits }) => {
    const circles = selection.selectAll('circle').data(fruits, d => d.id)

    circles
        .enter().append('circle')
            .attr('cx', xPosition)
            .attr('cy', height / 2)
            .attr('r', d => radiusScale(d.type))
            .attr('fill', d => colorScale(d.type))
        .merge(circles)
            .on('mouseover', d => setSelectedFruit(d.id))
            .on('mouseout', () => setSelectedFruit(null))
            .attr('stroke', d => d.id === selectedFruit ? 'navy' : 'none')
            .transition().duration(1000)
                .attr('cx', xPosition)
                .attr('r', d => radiusScale(d.type))
                .attr('fill', d => colorScale(d.type))
    circles
        .exit()
        .transition().duration(1000)
            .attr('r', 0)
        .remove()
}

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

/* eating another apple on 2nd position! */
setTimeout(() => {
    fruits = fruits.filter((d, i) => i !== 1)
    render(svg, { fruits })
}, 3000)