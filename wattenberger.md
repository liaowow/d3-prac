## Table of Contents
- [Grabbing Data](#grabbing-data)
- [Manipulating Data](#manipulating-data)
- [Manipulating the DOM](#manipulating-dom)
- [Drawing SVG Shapes](#drawing-svg)
- [Converting Data to the Physical Domain](#converting-data)
- [Dealing with Colors](#colors)
- [Dealing with Datetime](#datetime)
- [Animation](#animation)

### <a name="grabbing-data"></a>Grabbing Data

[`d3-fetch`](https://github.com/d3/d3-fetch) provides some utility methods that will fetch data from a file and parse it into a Javascript object.

In `d3-fetch`, the methods are just the names of the file format, and they take one parameter: the URL of your file. When you execute one of these methods, they'll respond with a `Promise`, which will resolve with the parsed data.

For example, to grab the current weather in Oslo, Norway, we can query the MetaWeather API and grab the temperature from the parsed response:

```js
const url = "https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/862592/"
d3.json(url)
  .then(res => {
    alert(`Current temperature: ${
      res.consolidated_weather[0].the_temp
    }°C`)
  })
  .catch(() => {
      alert("Oh no, something horrible happened!")
  })
```

#### d3-dsv

One of the nice things about the d3 API is that it's very modular. This allows us to often use its internal logic if we want to.

[`d3-dsv`](https://github.com/d3/d3-dsv) has many methods for converting between Javascript objects and **dsv** format. It also has some command-line utilities for converting between JSON, dsv, and dsv with different delimiters.


### <a name="manipulating-data"></a>Manipulating Data

#### d3-array

There are 11 methods in `d3-array` that help answer basic questions about a dataset. 

The methods that probably get the most use are the ones that will find the highest and lowest value (`d3.max()` / `d3.min()`), and the method that returns the extremes (`d3.extent()`). These come in handy when creating a **scale**.

To use any of these methods, we want to call it with two parameters:
1. our dataset -- needs to be an array containing the values we're interested in
2. accessor function (optional) -- tells d3 how to find a value within one data point. This defaults to an identity function (`d => d`), which means this parameter is unnecessary if our dataset is an array of values.
```js
const dataset = [{
    date: "2019-10-10",
    temp: 10,
},{
    date: "2019-10-11",
    temp: 12,
}]

const mean = d3.mean(dataset, d => d.temp)
alert(mean)
```

##### Ordering

`d3-array` can also help with finding specific items in an array in two main ways:
1. Find the item with the smallest value -- `d3.least()` will return the item and `d3.leastIndex()` will return the item's index.
2. Find the item *nearest to* a specific value -- `d3.bisect()` will take a sorted array and a value and return the index at which the value would fit.
```js
const array = [10, 20, 30, 40, 50, 60]
const nearestValueIndex = d3.bisect(array, 12)
alert(nearestValueIndex) // is 1
// compiled array: [10, 12, 20, 30...]
```

There are a few similar bisect functions for things like using an accessor or comparator function (`d3.bisector()`) or specifying whether you want the index to be lower than (`d3.bisectLeft()`) or higher than (`d3.bisectRight()`) existing matching values.

These bisector functions are very handy when creating tooltips - finding the closest point to the user's cursor is a great way to make a chart easy to interact with.

There are also two handy comparator functions that you can use: `d3.ascending()` and `d3.descending()`.

##### Transformation

There are a handful of `d3-array` functions that would look at home in a utility library like [Lodash](https://lodash.com/). These allow you to do things like:
- Group a list of objects by a specific key: `d3.group()` returned the grouped objects and `d3.rollup()` returned the grouped indices
- Create a list of permutations of two arrays: `d3.cross()`
- Create a new array by pulling items at specific indices or keys: `d3.permute()`
- Shuffle the items of array: `d3.shuffle()`
- Create an array counting between two numbers: `d3.range()`
- Zip two arrays: `d3.zip()`

##### Binning

There is also [a group of d3-array methods](https://github.com/d3/d3-array#bins) that will chunk a dataset into bins. This is really helpful for creating bucketed charts like histograms.


#### d3-random

Our browsers have a built-in `Math.random()` function, which is good for simple use-cases. But what if you want your random data to have structure?

`d3-random` lets you create random numbers with specific distributions. 

For example, the normal distribution (`d3.randomNormal()`) is helpful for generating numbers that are normally distributed around a specific value.


### <a name="manipulating-dom"></a>Manipulating the DOM

#### d3-selection

d3-selection has an alternative method to `document.querySelector()` called `d3.select()`.

This method creates a **d3 selection object** that has many helper methods.

The d3-selection update pattern is a common gotcha when learning d3. It’s important that you understand it well before using it, so read up on the basic pattern on [this guide by Mike Bostock](https://observablehq.com/@d3/selection-join).

D3 selection objects have other methods; here's a few additional things they can help with:
- `.on()` & `.dispatch()` -- listening to (and dispatching) mouse & touch events. D3 also provides `d3.mouse()` and `d3.touch()` methods that return the cursor position
- `.attr()` & `.style()` & `.property()` -- updating elements’ attributes and styles
- `.text()` & `.html()` -- modifying text
- `.sort()` & `.order()` & `.raise()` & `.lower()` -- re-ordering elements
- `.transition()` -- adding transitions and animations

#### d3-selection-multi

d3 selection objects have `.style()` and `.attr()` methods to update the styles or attributes of DOM elements. But we can only *update one value per call*.

d3-selection-multi adds `.styles()` and `.attrs()` methods to our d3 selection objects that will take an object of updates.


For example, this code:
```js
d3.select("#this-last-paragraph")
  .style("color", "cornflowerblue")
  .style("font-style", "italic")
  .style("font-weight", "bold")
```
can be written like so:
```js
d3.select("#this-last-paragraph")
  .styles({
      "color":       "cornflowerblue",
    "font-style":  "italic",
    "font-weight": "bold",
  })
```

As you can see, this module mostly helps with code organization -- you might even prefer the original format!

- Note that this is an external module and is not included in the core d3.js bundle. If you want to use it, you’ll need to [roll your own d3.js bundle](https://bl.ocks.org/mbostock/bb09af4c39c79cffcde4) or [import it into your site individually](https://github.com/d3/d3-selection-multi#installing).

### <a name="drawing-svg"></a>Drawing SVG Shapes

#### Canvas

There is an HTML <canvas> element that we can draw on to create raster images. Doing this involves using native Javascript methods, such as `fillRect()`.

Canvas can be tedious to work with because of its imperative nature, and any shapes we draw are collapsed into one DOM element. It can be way more performant, however, when you’re trying to render many elements, since each element doesn't have the overhead of a DOM element.

#### WebGL

Everything I just said about Canvas applies even more so to WebGL. WebGL is an **API** to draw on `<canvas>` elements using low-level shader code, and it’s really fast since it is processed by your computer’s GPU.

#### SVG

`SVG` is the main method used for data visualization in the browser. Within an `<svg>` element, we can use SVG elements the same way we use HTML elements.

We can even use CSS properties to style our SVG elements, although they play by different rules.

#### d3-shape

While things like circles and rectangles are easy to draw, we’ll often want to draw more complex shapes to visualize our data. `d3-shape` can help us create those shapes in SVG and Canvas.

##### Arcs

While a circle may be easy to draw in both SVG and Canvas, a segment of a circle is not. `d3.arc()` makes it easy to create an arc with a specific start and end angle, plus some other optional parameters.
```js
const arcGenerator = d3.arc()
  .innerRadius(25)
  .outerRadius(40)
  .startAngle(0)
  .endAngle(5.5)
  .padAngle(0)
  .cornerRadius(20)
const arcPath = arcPathGenerator()
```
```html
<svg width="100" height="100">
  <path
    fill="cornflowerblue"
    d={arcPath}
    style="transform: translate(50%, 50%)"
  />
</svg>
```
- Calling an `d3.arc()` will create a string for the `d` attribute of an SVG `<path>` element. We can alternatively use an arc’s `.context()` method to draw it on Canvas.
- `d3.pie()` can help us calculate the angles for a pie or donut chart, which can be passed to `d3.arc()`.

##### Lines

Often we'll want to draw a line that changes x- or y-position based on a metric in our dataset, like in a timeline. `d3.line()` can help us draw such a line, and `d3.area()` can help us draw a filled area.

##### Curves

Typically, lines created with d3 will connect each data point with straight lines. You might want to smooth the line a bit, to help the viewer focus on the overall shape instead of local noise.

To help out, you can pass one of [d3's interpolation functions](https://github.com/d3/d3-shape#curves) to your `d3.line()`'s' (or area, etc) `.curve()` method.

##### Links

If you need to create a smooth curve connecting two points, `d3-shape` has functions for [vertical](https://github.com/d3/d3-shape#lineVertical), [horizontal](https://github.com/d3/d3-shape#lineHorizontal), and [radial](https://github.com/d3/d3-shape#lineRadial) links.

##### Symbols

d3 has methods for drawing several common basic symbols. Each of these symbols is centered around the middle point ⬤, making them easy to position for charts like scatter plots.

You can also create your own symbols, although the SVG `<use>` element could be a more performant alternative.

##### Stacks

`d3.stack()` won't draw any shapes directly, but can help compute positions for stacked elements, which can help with things like stacked bar charts and streamgraphs.

#### d3-path

`d3-path` is used to create the shapes in `d3-shape`, but can be used to create your own custom paths.

To create a complex shape in SVG, you need to construct a `d` attribute string for a `<path>` element.
```html
<path d="M 2 3 L 4 5 L 1 4 Z" />
```

### <a name="converting-data"></a>Coverting Data to Physical Domain

A **scale** is an essential concept when visualizing data. To physicalize a dataset, you must turn each metric into a **visual feature**.

**d3 scales** are a one of the most important concepts for visualizing data with d3 - make sure to familiarize yourself with them so you can convert between any data domain and the output range with ease.

`d3 scales` have many useful methods, here are a few:
- `.ticks()` -- returns an array of equally-spaced values in the output range. It defaults to 10 values, but you can pass a different count for it to aim for.
```js
const xScale = d3.scaleLinear()
  .domain([0, 1]) // possible chanceOfPrecipitation values
  .range([0, 500]) // possible x values

const ticks = xScale.ticks()
alert(ticks)
```

- `.nice()` -- extends the data domain so that it starts and ends on round values. This can make your chart friendlier to readers, since 250 is an easier number to process than 249.5.

- `.clamp()` -- ensures that the scale will return a value within the range, even if the input is outside of the domain. For example, our xScale will, by default, return 1000 for an input of 2.
```js
const xScale = d3.scaleLinear()
  .domain([0, 1]) // possible chanceOfPrecipitation values
  .range([0, 500]) // possible x values

const output = xScale(2)
alert(output)
```

- `.invert()` -- converts a value *backwards*, from the output range to the data domain. This comes in handy for things like surfacing a **tooltip** where a user’s mouse is hovering.
```js
const xScale = d3.scaleLinear()
  .domain([0, 1]) // possible chanceOfPrecipitation values
  .range([0, 500]) // possible x values

const chanceOfPrecipitationAt250 = xScale.invert(250)
alert(chanceOfPrecipitationAt250)
```

- `.domain()` and `.range()` -- if we created our scale programatically, we can query what its domain and range are.
```js
const xScale = d3.scaleLinear()
  .domain([0, 1]) // possible chanceOfPrecipitation values
  .range([0, 500]) // possible x values

const range = xScale.range()
const domain = xScale.domain()
alert(`range: ${range}, \ndomain: ${domain}`)
```

- `.interpolate()` -- something that might not be immediately obvious is that we can create a scale that converts a value into a **color**. We can use `.interpolate()` to specity the **color space** that we want our scale to function within:
```js
const xScale = d3.scaleLinear()
  .domain([0, 1]) // possible chanceOfPrecipitation values
  .range(["white", "green"]) // possible colors

const halfwayPointRgb = xScale(0.5)
xScale.interpolate(d3.interpolateHcl)
const halfwayPointHcl = xScale(0.5)
alert(`rgb: ${halfwayPointRgb}, \nhcl: ${halfwayPointHcl}`)
```

### <a name="colors"></a>Dealing with Colors

Here to save the day is **d3-color**! To start, pass any valid CSS color string to `d3.color()`. Valid inputs include:
- [color keywords](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#Color_keywords) -- there are currently 148 CSS color keywords, including `cornflowerblue`, `lavender`, and `turquoise`.

There are two extra special values:
1. **transparent**, which specifies no color, and
2. **currentColor**, which inherits the CSS color property. 

`d3.color()` will create a d3 color in the **RGB** color space, the same as `d3.rgb()`.

#### d3-scale-chromatic

**d3-scale-chromatic**’s many schemes and scales can be categorized into four different use cases:
1. CATEGORICAL -- [Categorical color scales](https://github.com/d3/d3-scale-chromatic#categorical) are good for representing **nominal** variables, where values are bucketed in a non-ordered manner.
2. 
- SEQUENTIAL (SINGLE HUE) -- [Sequential color scales with a single hue](https://github.com/d3/d3-scale-chromatic#sequential-single-hue) are good for representing **ordinal**, **discrete**, and **continuous** metrics, where values lie on a scale between two extremes. For example: chance of precipitation.
- SEQUENTIAL (MULTI-HUE) -- [Sequential color scales with multiple hues](https://github.com/d3/d3-scale-chromatic#sequential-multi-hue) can increase the visual space of a sequential color scale, making different values easier for the human eye to differentiate.
3. DIVERGING -- [Diverging color scales](https://github.com/d3/d3-scale-chromatic#diverging) are good highlighting the extreme ends of the data domain. For example: hot and cold temperatures, or positive and negative numbers.
4. CYCLICAL -- [Cyclical color scales](https://github.com/d3/d3-scale-chromatic#cyclical) are good for representing metrics whose values loop. For example: days in a year.

#### d3-interpolate

If you want to create your own custom color scale, you can use an ordinal or sequential scale and use [`d3-interpolate`’s color methods](https://github.com/d3/d3-interpolate#color-spaces) to specify a color space to transition within.


### <a name="datetime"></a>Dealing with Datetimes

#### d3-time-format

Javascript has a native `Date` object that represent a point in time down to the millisecond. We can turn a string into a Date by using `d3.timeParse()`.

`d3.timeParse()` takes one parameter: a specifier string that represents to format of your datetime. This string will be made up of individual specifiers: a combination of a % and a letter.

For example, if we wanted to parse the date string `Friday, May 29, 2020`, we could use the following code:
```js
const dateString = "Friday, May 29, 2020"
const today = d3.timeParse("%A, %B %d, %Y")(dateString)
// <Date> Fri May 29 2020 00:00:00 GMT-0400 (Eastern Daylight Time)
```

To create a linear scale for datetimes in our dataset, we would pass these parsed Dates to `d3.timeScale()`.

We can pass the same specifiers with `d3.timeFormat()` to convert a Date object back into a string, which comes in handy for labels and axes:
```js
const today = new Date()
const today = d3.timeFormat("%A, %B %d, %Y")(today)
```

If a specifier is zero-padded, adding a `-` will remove any beginning zeroes:
```js
const today = new Date()
const today = d3.timeFormat("%A, %B %-d, %Y")(today)
```

#### d3-time

But what if we need to modify datetimes?

`d3-time` has your back with a built-in set of intervals: `timeMillisecond`, `timeSecond`, `timeMinute`, `timeHour`, `timeDay`, `timeWeek`, `timeMonth`, and `timeYear`.

Each of these intervals has a handful of methods:
- `.floor()`, `.ceil()`, and `.round()` for creating a **Date** at the start, end, or closest boundary of the interval
- `.offset()` to offset the **Date** by a specified number of intervals
- `.range()` to create an array of **Date**s, one for each interval between a specified start and stop **Date**
- `.count()` to return the number of intervals that can fit between two specified **Date**s

For example, if I wanted to create a date time that was exactly one week after today, I could use `d3.timeWeek()`:
```js
d3.timeWeek.offset(new Date(), 1)
// <Date> Fri Jun 05 2020 15:30:21 GMT-0400 (Eastern Daylight Time)
```

### <a name="animation"></a> Animation

#### d3-interpolate

To animate a property from point A to point B, we need to create a series of states, smoothly interpolating between them. 

To create these in-between steps, we can use `d3.interpolate()`, which takes two parameters: point A and point B.

`d3.interpolate()` uses different methods (which are also surfaced), depending on the type of value of point B. For example, if point B is a number, it will use `d3.interpolateNumber()` and if point B is a date, it will use `d3.interpolateDate()`.
```js
const interpolator = d3.interpolate(0, 100)
interpolator(0  ) // 0
interpolator(0.5) // 50
interpolator(1  ) // 100
```

If we wanted to list out a number of steps, we could pass our interpolator to `d3.quantize()`, along with the number of steps that we wanted:
```js
const interpolator = d3.interpolate(0, 100)
const steps = d3.quantize(interpolator, 11)
// steps = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
```

#### d3-transition

We can create a **d3 transition** in two ways:
- on the document's **root element** using `d3.transition()`, or
- on a **d3 selection** using a **d3 selection**'s `.transition()` method

If we create the transition on a d3 selection, we can use the transition's `.attr()` (to change a HTML attribute) or `.style()` method (to change a CSS style) to animate a value.

For example, we can animate a <circle>'s position like so:
```js
d3.select("#circle")
    .attr("cx", 50)
  .transition()
    .attr("cx", 500)
```

We can tweak the timing of our <circle>'s transition using its `.delay()` and `.duration()` methods:
```js
d3.select("#circle2")
    .attr("cx", 50)
  .transition()
    .delay(500)
    .duration(2000)
    .attr("cx", 500)
```

#### d3-ease

Our transitions don't have to interpolate linearly from point A to point B. d3-ease is an entire d3 module that suppies different easing functions, which can be used to give your animations more personality.

To use these easing functions, we can pass them to our transition's `.ease()` method.
```js
d3.select("#circle5")
    .attr("cx", 50)
    .style("fill", "cornflowerblue")
  .transition()
    .delay(500)
    .duration(2000)
    .ease(d3.easeBounce)
    .attr("cx", 500)
  .transition()
    .duration(1000)
    .ease(d3.easeElasticInOut)
    .style("fill", "lavender")
  .transition()
    .duration(1000)
    .ease(d3.easeBounceOut)
    .attr("cx", 50)
    .style("fill", "cornflowerblue")
```

#### d3-timer

Now we know how to create animated transitions between two states, but how do we create a constantly running animation?

`d3.timer()` will call a callback function continuously, passing it the milliseconds that have elapsed since initialization.
```js
const timer = d3.timer(elapsed => {
  d3.select("#elapsed")
    .html(Math.round(elapsed))
  if (elapsed > 10000) timer.stop()
})
```

Note that we can use `d3.stop()` to stop our timer after a certain amount of time.

We can also execute a callback once, after a certain amount of time using `d3.timeout()`, and on an interval using `d3.interval()`.

While there are native javascript methods for creating intervals, timeouts, and timers, `d3-timer` has some performance enhancements (using [`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)) and won't run when the user's tab isn't open.

### Maps and Globes

#### d3-geo

Because our goal is to represent a 3d sphere (Earth) onto a 2d plane (a computer screen), we’re going to have to decide on a set of rules for how to handle the transformation. This set of rules is called a **projection**.

Part of the reason that `d3-geo` is so large (it’s the largest module in the core build) is because it contains 15 projections.

There are even two d3 modules that aren’t in the core build that provide extra projections:
- [d3-geo-projection](https://github.com/d3/d3-geo-projection) -- the largest d3 module, adding 100 projections
- [d3-geo-polygon](https://github.com/d3/d3-geo-polygon) -- a d3 module that handles spherical polygons, adding 8 projections.

When creating a map with `d3-geo`, you’ll want to be familiar with two concepts:
1. importing the geographic shapes
2. projecting those shapes onto the world

d3-geo has a `d3.geoPath()` method that will take a d3 projection and create a path generator. We can then take our path generator and use it to transform our geographic shapes into a <path>’s d attribute string.

