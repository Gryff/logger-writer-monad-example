'use strict'

import express from 'express'
import Logger from 'whatever-logger'
import buildViewModel from './stockTrendViewModel'
import Guid from './guidGenerator'

const app = express()

app.get('/', stockTrendPage)

function stockTrendPage (req, res) => {
  const requestLogger = new Logger('/', new Date(), new Guid())

  getWeatherData()
    .then(logCallThen(predictStockMarketTrendsBasedOnWeather))
    .then(logCallThen(buildViewModel))
    .then(logCallThen(renderStockTrendPage))
    .then(() => {
      requestLogger.writeLog()
    })

  function logCallThen (nextAsyncFunction) {
    return ([data, logText]) => {
      requestLogger.append(logText)
      return nextAsyncFunction(data)
    }
  }

  function renderStockTrendPage (viewModel) {
    res.render('stockMarketTrendPage', viewModel)
  }
}

function getWeatherData () {
  const weatherData = [
    { day: 'monday', weather: 'rain' },
    { day: 'tuesday', weather: 'more rain' },
    { day: 'wednesday', weather: 'less rainy today' },
    { day: 'thursday', weather: 'err... not sure to be honest' }
  ]

  return [weatherData, 'retrieved incredibly accurate weather data']
}

function predictStockMarketTrendsBasedOnWeather (weatherData) {
  const stockMarketTrends = weatherData.map(weatherItem => {
    return {
      day: weatherItem.day,
      trend: getTrendFromWeather(weatherItem.weather)
    }
  })

  return [stockMarketTrends, 'generated supremely accurate stock predictions']

  function getTrendFromWeather (weather) {
    if (weather === 'rain') return '-1.00%'
    if (weather === 'more rain') return '-2.00%'
    if (weather === 'less rainy today') return '+0.50%'
    if (weather === 'err... not sure to be honest') return '+10.00%'
  }
}
