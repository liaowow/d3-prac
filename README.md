## Overview

The name d3 comes from the three D’s in the term “Data-Driven Documents.”

Key Features:
- d3 revolutionized the way data visualizations are built natively for the web by associating data with elements on a website’s Document Object Model.
- d3 is a visually elegant library that offers a wide range of pre-packaged visualizations (from Tree-models to Sankey funnels)
- d3 leaves a lot of room for creative customization because the elements the data are bound to can be styled like any regular DOM element
- d3 supports interactivity triggered by browser events

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

There are a handful of `d3-array` functions that would look at home in a utility library like Lodash. These allow you to do things like:
- Group a list of objects by a specific key: `d3.group()` returned the grouped objects and `d3.rollup()` returned the grouped indices
- Create a list of permutations of two arrays: `d3.cross()`
- Create a new array by pulling items at specific indices or keys: `d3.permute()`
- Shuffle the items of array: `d3.shuffle()`
- Create an array counting between two numbers: `d3.range()`
- Zip two arrays: `d3.zip()`

##### Binning

There is also [a group of d3-array methods](https://github.com/d3/d3-array#bins) that will chunk a dataset into bins. This is really helpful for creating bucketed charts like histograms.


### Selection

For D3 to inject or bind data to elements, a D3 selection of elements needs to be created. 
D3 selections are created with the `.selectAll()` or `.select()` methods.
- The `.select()` method returns the first element that matches a selector string.
- The `.selectAll()` returns an array-like structure with grouped nodes for all the elements that match the selector.

Reference: [Mike Bostock's article](https://bost.ocks.org/mike/selection/)


### Data-Element Relationship

The `.data()` method takes an array of any type as its parameter and binds a datum to each element in the selection returned by `.selectAll()`:
```js
let dataset = [55,34,23,22,59];
d3.selectAll("p")
   .data(dataset);
```

- We have five items inside dataset and we assume there are five `<p>` elements in the HTML.
- Every instruction that follows the `.data()` method is therefore executed five times.
- The `.data()` function accepts an array of any type (in this example, we use an array of numbers).
- The data is bound to elements as a property.
- Binding data to the elements allows the data to remain associated with the elements on the DOM even after you want to re-use the `.selectAll()` method to create a new selection.


### The d parameter

Think of the `d` as representing the d in data. It represents the value bound to each element in the d3 chain.
```js
let dataset = [55,34,23,22,59];

let svg = d3.select("body")
                 .selectAll("div")
                 .data(dataset)
                 .text(function(d) {
                         return d;
                  });
```
- The `.text()` method took an anonymous function with a d parameter that returns the data value inside each of the div elements.
- d3 will append that value as the text inside each of the five `div` elements it created from the `dataset` array.
- The `.data()` method assigns the correct value to the d parameter, or the first parameter, for the elements in question.
- The functions you use don’t always need to be anonymous, but you do need to include a `d` parameter, or a first argument, if you want to access the data.
- You can also optionally include an `i` parameter, or second parameter, if you want to access the index.
- If we wanted to introduce more complicated logic like conditionals, a loop, or append other text, we could achieve this just like we would in the body of any other function.


### Styling Data

The `.attr()` method takes two parameters: 
1. the HTML attribute you wish to change, and 
2. the value you wish to assign it.

Similarly, the `.style()` method takes two parameters: 
1. the CSS property you wish to change, and 
2. the value you wish to assign it.

```js
let svg = d3.select("body")
            .selectAll("div")
            .data(dataset)
            .attr("id", function(d,i){ 
                    return "element-" + i; 
                })
            .style("width", function(d){
                   return d + "px";
                });
```
- The `.attr()` method changed the HTML attribute `id` to be based on the element index in the dataset
- The `.style()` method computed the width to be a function of the datum value


### Enter and Append

#### Enter
- The `.enter()` method consolidates the difference between the number of existing elements in the selection and the number of elements in the dataset.
- It is invoked on the update selection that `.data()` returns.
- If there are more data points than existing “selected” elements, `.enter()` creates placeholder elements and returns an enter selection which specifies which elements need to be added.
- For example, if there were 0 existing elements in the update selection and 10 data points, enter would compute 10 elements in the enter selection.
- The `.enter()` method does not actually append the elements, it just computes how many need to be added.

#### Append
- The `.append("element")` method takes a string parameter with the element name you wish to append, it then analyzes the selection that gets handed off to it, and generates the specified elements on the DOM.
- It returns a reference to the elements it created.

Note: 
If you ever want to analyze the data in the selection and log it to the console, you can always use the `.nodes()` method on your selection. This method will log the array of grouped nodes in the selection.

After making a selection, creating a new visualization, whose elements are not already in the DOM, usually follows the `.data()` `.enter()` and `.append()` pattern:
```js
let dataset = [55,34,23,22,59];
d3.select("body")
   .selectAll("div")
   .data(dataset)
   .enter()
   .append("div");
```
- Everything after `.data()` will therefore get executed five times
- The `.enter()` method created five placeholder elements because there were no div elements in the DOM
- Five div’s were appended with the div elements
- Those divs each have a `_data_` property with the values of 55, 34, 2, 22, 59, respectively
- Each step of the chain returned a reference to those elements.


### Chaining and Returning

You’ll see that the d3 community will indent some parts of the chains with four spaces, and other parts of the chain with two. The lines with two spaces indicate that the selection has changed:
```js
var h1 = d3.selectAll("section")
    .style("background", "steelblue")
  .append("h1")
    .text("Hello!");
```

### Interactivity with Events

Here's a basic d3 design pattern:
1. Create a selection
2. Associate data with that selection
3. Append elements to the DOM
4. Modify the elements based on the data

```js
selection
    .on("mouseover", function(d,i) {
          d3.select(this).text(d);
    });
```
- The `.on()` method takes a string parameter with the name of the event and a function to handle that event when it is triggered. It binds an event listener to the elements in the selection. 
- In the body of the function, we use the `this` keyword. In the function’s context, `this` refers to the event’s DOM element.
- The code modifies the text on mouse over, by selecting it with d3 and appending new text.
- You can pass different types of events, some of the most popular events include `"click"`, `"mouseover"`, `"mouseout"`, `"mouseenter"` and more.

## Recap
- Selections are array-like data structures that include a reference to the elements with D3 methods and their hierarchy in the DOM.
- You can create a selection with `.selectAll()` or a single-item selection with `.select()`
- The `.data()`, `.enter()` and `.append()` methods all work in unison to create elements and associate their corresponding data with the existing DOM
- The `d` parameter inside functions used in a D3 context represents the datum associated with the element at hand
- The `.attr()` and `.style()` methods allow you to customize the appearance of each element based on data.
The `.on()` method can bind an event listener on the elements in the selection.


### Resource
Codecademy -- [Learn D3](https://www.codecademy.com/learn/learn-d3) <br/>
Amelia Wattenberger -- [Blog: Learn Data Viz](https://wattenberger.com/blog/d3#grabbing-data)