const { getAllLaunches, abortLaunch } = require('../../models/launches-model')

function httpGetAllLaunches(req, res) {
    return res.status(200).json(getAllLaunches())
}

function httpAbortLaunch(req, res) {
    const id = req.params.id
    // check if id not found return 404
    return res.status(200).json(abortLaunch(parseInt(id)))
}

module.exports = {
    httpGetAllLaunches,
    httpAbortLaunch
}