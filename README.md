## Overview

The name d3 comes from the three D’s in the term “Data-Driven Documents.”

Key Features:
- d3 revolutionized the way data visualizations are built natively for the web by associating data with elements on a website’s Document Object Model.
- d3 is a visually elegant library that offers a wide range of pre-packaged visualizations (from Tree-models to Sankey funnels)
- d3 leaves a lot of room for creative customization because the elements the data are bound to can be styled like any regular DOM element
- d3 supports interactivity triggered by browser events


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

### Resource
Codecademy -- [Learn D3](https://www.codecademy.com/learn/learn-d3)