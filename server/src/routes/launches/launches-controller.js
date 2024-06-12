const { getAllLaunches, abortLaunch, scheduleNewLaunch } = require('../../models/launches-model')
const { getPagination } = require('../../services/query')

async function httpGetAllLaunches(req, res) {
    const { sort } = req.query
    const { skip, limit } = getPagination(req.query);
    const launches = await getAllLaunches(skip, limit, sort);
    return res.status(200).json(launches);
}

async function httpAbortLaunch(req, res) {
    const id = req.params.id
    const abortResponse = await abortLaunch(parseInt(id))

    if (abortResponse.code === 404) {
        return res.status(404).json({status: `Launch with flight number ${id} not found`})
    }
    
    if(abortResponse.code === 500) {
        return res.status(500).json({status: 'Failed to abort launch'})
    }

    return res.status(200).json({status: `Launch with flight number ${id} aborted`})
}

async function httpAddNewLaunch(req, res) {
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

    await scheduleNewLaunch(launch)
    return res.status(201).json(launch)
}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch
}