const { getAllLaunches, abortLaunch, scheduleNewLaunch } = require('../../models/launches/launches-model')
const { getPagination } = require('../../utils/query')
const catchAsync = require("../../utils/catch-async")

async function httpGetAllLaunches(req, res) {
    const { sort } = req.query
    const { skip, limit } = getPagination(req.query);
    const launches = await getAllLaunches(skip, limit, sort);
    return res.status(200).json(launches);
}

async function httpAbortLaunch(req, res, next) {
    const id = req.params.id

    try {
        await abortLaunch(id)
        return res.status(200).json({status: `Launch with flight number ${id} aborted`})
    } catch(err) {
        next(err)
    }
}

async function httpAddNewLaunch(req, res, next) {
    const launch = req.body;

    if (!launch.mission || !launch.rocket || !launch.launchDate
        || !launch.target) {
        return res.status(400).json({
            error: 'Missing required launch property',
        });
    }

    launch.launchDate = new Date(launch.launchDate);
    if (isNaN(launch.launchDate)) {
        return res.status(400).json({
        error: 'Invalid launch date',
        });
    }

    try {
        await scheduleNewLaunch(launch)
        return res.status(201).json(launch)
    } catch(err) {
        next(err)
    }
}

module.exports = {
    httpGetAllLaunches: catchAsync(httpGetAllLaunches),
    httpAddNewLaunch: catchAsync(httpAddNewLaunch),
    httpAbortLaunch: catchAsync(httpAbortLaunch)
}