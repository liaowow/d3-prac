// import { select, arc } from 'd3'

const svg = d3.select('svg')
svg.style('background-color', 'darkseagreen')

const width = svg.attr('width')
const height = svg.attr('height')
const colorScale = d3.scaleOrdinal()
        .domain(['apple', 'lemon'])
        .range(['#c11d1d', '#eae600'])
const radiusScale = d3.scaleOrdinal()
        .domain(['apple', 'lemon'])
        .range([50, 30])
const xPosition = (d, i) => i * 150 + 180

// rendering logic
const render = (selection, { fruits }) => {
    // create bowl
    selection.selectAll('rect')
        .data([null])
        .enter().append('rect')
            .attr('width', 920)
            .attr('height', 300)
            .attr('y', 100)
            .attr('x', 15)
            .attr('rx', 150)

    // create group element
    const groups = selection.selectAll('g').data(fruits)
    const groupsEnter = groups.enter().append('g')

    groupsEnter.merge(groups)
        .attr('transform', (d, i) => `translate(${i * 150 + 180}, ${height / 2})`)
    
    groups.exit().remove()

    // create circles
    groupsEnter.append('circle')
        .merge(groups.select('circle'))
        .transition().duration(1000)
            .attr('r', d => radiusScale(d.type))
            .attr('fill', d => colorScale(d.type))

    // create labels
    groupsEnter.append('text')
        .merge(groups.select('text'))
        .transition().duration(1000)
            .text(d => d.type)
            .attr('y', 100)
}

// state manipulation logic
const makeFruit = type => ({ 
    type,
    id: Math.random()
})
let fruits = d3.range(5).map(() => makeFruit('apple'))

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