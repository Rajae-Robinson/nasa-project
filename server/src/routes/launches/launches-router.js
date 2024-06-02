const express = require('express')
const { httpGetAllLaunches, httpAbortLaunch } = require('./launches-controller')

const launchesRouter = express.Router()

launchesRouter.get('/', httpGetAllLaunches)
launchesRouter.post('/', () => {})
launchesRouter.delete('/:id', httpAbortLaunch)

module.exports = launchesRouter