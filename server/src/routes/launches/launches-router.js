const express = require('express')
const { httpGetAllLaunches, httpAbortLaunch, httpAddNewLaunch } = require('./launches-controller')
const { protect, restrictTo } = require('../../middlewares/auth-middleware')

const launchesRouter = express.Router()

launchesRouter.get('/', httpGetAllLaunches)

launchesRouter.post('/', protect, httpAddNewLaunch)
launchesRouter.delete('/:id', protect, httpAbortLaunch)
// launchesRouter.delete('/:id', protect, restrictTo('admin'), httpAbortLaunch)

module.exports = launchesRouter