### Grabbing Data

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


### Manipulating Data

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


### Manipulating the DOM

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