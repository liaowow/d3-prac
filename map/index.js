const svg = d3.select('svg')

const projection = d3.geoOrthographic()
const pathGenerator = d3.geoPath().projection(projection)

svg.attr('transform', 'translate(0, 25)')

svg.append('path')
  .attr('class', 'sphere')
  .attr('d', pathGenerator({type: 'Sphere'}))


Promise.all([
  d3.tsv('https://unpkg.com/world-atlas@1.1.4/world/50m.tsv'),
  d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
]).then(([tsvData, jsonData]) => {
  const countryName = tsvData.reduce((accumulator, d) => {
    accumulator[d.iso_n3] = d.name
    return accumulator
  }, {})

  const countries = topojson.feature(jsonData, jsonData.objects.countries)

  svg.selectAll('path').data(countries.features)
    .enter().append('path')
      .attr('class', 'country')
      .attr('d', d => pathGenerator(d))
    .append('title')
      .text(d => countryName[d.id])
})

