import { cars } from 'cars'
import { generateReport } from 'generateReport'

// cars = require('cars')
// generateReport = require('generateReport')


const message = generateReport(cars, 2000)

document.getElementById('message-element').textContent = message