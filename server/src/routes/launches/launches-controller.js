const { getAllLaunches, abortLaunch, scheduleNewLaunch } = require('../../models/launches-model')

async function httpGetAllLaunches(req, res) {
    return res.status(200).json(await getAllLaunches())
}

function httpAbortLaunch(req, res) {
    const id = req.params.id
    // check if id not found return 404
    return res.status(200).json(abortLaunch(parseInt(id)))
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