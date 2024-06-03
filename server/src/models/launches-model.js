const launches = require('./launches-mongo')
const planets = require('./planets-mongo')

DEFAULT_FLIGHT_NUMBER = 100

async function getLatestFlightNumber() {
    const latestLaunch = await launches
        .findOne({})    
        .sort('-flightNumber')

    if(!latestLaunch) return DEFAULT_FLIGHT_NUMBER

    return latestLaunch.flightNumber
}

async function saveLaunch(launch) {
    const planet = await planets.findOne({keplerName: launch.target})

    if (!planet) { 
        throw new Error('No matching planet was found')
    }

    await launches.updateOne({
        flightNumber: launch.flightNumber
    }, launch, {
        upsert: true
    })
}

async function getAllLaunches() {
    return await launches.find({}, {_id: 0, __v: 0})
}

async function scheduleNewLaunch(launch) {
    const newFlightNumber = await getLatestFlightNumber() + 1

    const newLaunch = Object.assign(launch, {
        success: true,
        upcoming: true,
        customers: ['ZTM', 'NASA'],
        flightNumber: newFlightNumber
    })

    await saveLaunch(newLaunch)
}

function abortLaunch(id) {
    // const launch = launches.get(id)
    // launch.upcoming = false
    // launch.success = false
    // return launch
    return undefined
}

module.exports = {
    getAllLaunches,
    scheduleNewLaunch,
    abortLaunch
}