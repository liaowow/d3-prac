const svg = d3.select('svg')
const g = svg.append('g')

const projection = d3.geoNaturalEarth1() // globe: geoOrthographic
const pathGenerator = d3.geoPath().projection(projection)

svg.attr('transform', 'translate(0, 25)')

g.append('path')
  .attr('class', 'sphere')
  .attr('d', pathGenerator({type: 'Sphere'}))

svg.call(d3.zoom().on('zoom', () => {
  g.attr('transform', d3.event.transform)
}))

Promise.all([
  d3.tsv('https://unpkg.com/world-atlas@1.1.4/world/50m.tsv'),
  d3.json('https://unpkg.com/world-atlas@1.1.4/world/50m.json')
]).then(([tsvData, jsonData]) => {
  // using reduce():
  const countryName = tsvData.reduce((accumulator, d) => {
    accumulator[d.iso_n3] = d.name
    return accumulator
  }, {})

  /* using forEach():
  const countryName = {}
  tsvData.forEach(d => {
    countryName[d.iso_n3] = d.name
  })
  */ 

  const countries = topojson.feature(jsonData, jsonData.objects.countries)

  g.selectAll('path').data(countries.features)
    .enter().append('path')
      .attr('class', 'country')
      .attr('d', d => pathGenerator(d))
    .append('title')
      .text(d => countryName[d.id])
})

