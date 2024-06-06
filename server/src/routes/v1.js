const express = require('express')

const planetsRouter = require('./planets/planets-router')
const launchesRouter = require('./launches/launches-router')

const v1API = express.Router()

v1API.use('/planets', planetsRouter)
v1API.use('/launches', launchesRouter)

module.exports = v1API