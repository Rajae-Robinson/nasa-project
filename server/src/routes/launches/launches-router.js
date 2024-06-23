const express = require('express')
const { httpGetAllLaunches, httpAbortLaunch, httpAddNewLaunch } = require('./launches-controller')
const { protect, restrictTo } = require('../../middlewares/auth-middleware')

const launchesRouter = express.Router()

launchesRouter.get('/', httpGetAllLaunches)

launchesRouter.post('/', protect, restrictTo('admin'), httpAddNewLaunch)
launchesRouter.delete('/:id', protect, restrictTo('admin'), httpAbortLaunch)

module.exports = launchesRouter