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

async function abortLaunch(id) {
    const launch = await launches.findOne({flightNumber: id})

    if(!launch) return {code: 404}

    launch.upcoming = false
    launch.success = false

    try {
        await launch.save()
    } catch(err) {
        console.error('Error aborting launch:', error);
        return {code: 500}
    }
    
    return {code: 200}
}

module.exports = {
    getAllLaunches,
    scheduleNewLaunch,
    abortLaunch
}