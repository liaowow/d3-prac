// import { formatCar } from '/formatCar'

formatCar = require('formatCar')

export const generateReport = (cars, maxPrice) => 
  cars
    .filter(car => car.price < maxPrice)
    .map(formatCar)
    .join('\n')