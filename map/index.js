const svg = d3.select('svg')

const projection = d3.geoOrthographic()
const pathGenerator = d3.geoPath().projection(projection)

svg.attr('transform', 'translate(0, 25)')

svg.append('path')
  .attr('class', 'sphere')
  .attr('d', pathGenerator({type: 'Sphere'}))

d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
  .then(data => {
     const countries = topojson.feature(data, data.objects.countries)
     const paths = svg.selectAll('path')
             .data(countries.features)
     paths.enter().append('path')
       .attr('class', 'country')
       .attr('d', d => pathGenerator(d))	
  })

