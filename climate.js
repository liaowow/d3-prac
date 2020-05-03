let climate_daly_data = [
    {region: "Low-and-middle-income countries of the African Region", deaths: 57},
    {region: "Low-and-middle-income countries of the Americas", deaths: 2},
    {region: "Low-and-middle-income countries of the Eastern Mediterranean Region", deaths: 20},
     {region: "Low-and-middle-income countries of the European Region", deaths: 0.67},
     {region: "Low-and-middle-income countries of the South-East Asia Region", deaths: 58},
    {region: "Low-and-middle-income countries of the Western Pacific Region", deaths: 4},
    {region: "High income countries", deaths: 0.23}
];


let toggleClass = (i,toggle) => {
d3.select("#viz div:nth-child("+ i +")").classed("highlightBar",toggle);
d3.select("#legend li:nth-child("+ i +")").classed("highlightText",toggle);
};

