async function drawLineChart() {

  const dataset = await d3.json('./my_weather_data.json')
  // console.table(dataset[0])
  const yAccessor = d => d.temperatureMax
  const dateParser = d3.timeParse('%Y-%m-%d')
  const xAccessor = d => dateParser(d.date)
  
  let dimensions = {
    width: window.innerWidth * 0.9,
    height: 400,
    margin: {
      top: 15,
      right: 15,
      bottom: 40,
      left: 60
    }
  }

  dimensions.boundedWidth = dimensions.width
    - dimensions.margin.left
    - dimensions.margin.right

  dimensions.boundedHeight = dimensions.height
    - dimensions.margin.top
    - dimensions.margin.bottom

  const wrapper = d3.select('#wrapper')
    .append('svg')
      .attr('width', dimensions.width)
      .attr('height', dimensions.height)
  // console.log(svg)
}

drawLineChart()