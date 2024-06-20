const launches = require('./launches-schema')
const planets = require('../planets/planets-schema');
const { populateLaunches } = require('../../services/tesla-launch-data-service');
const { logger } = require('../../utils/logger');

DEFAULT_FLIGHT_NUMBER = 100

async function findLaunch(filter) {
    return await launches.findOne(filter);
}

async function loadLaunchData() {
    const firstLaunch = await findLaunch({
      flightNumber: 1,
    })
    if (firstLaunch) {
      logger.info('Launch data already loaded!')
    } else {
      await populateLaunches()
    }
  }

async function getLatestFlightNumber() {
    const latestLaunch = await launches
        .findOne({})    
        .sort('-flightNumber')

    if(!latestLaunch) return DEFAULT_FLIGHT_NUMBER

    return latestLaunch.flightNumber
}

async function getAllLaunches(skip, limit, sort='asc') {
  const sortOption = sort === 'desc' ? -1 : 1

  return await launches
    .find({}, { '_id': 0, '__v': 0 })
    .sort({ flightNumber: sortOption })
    .skip(skip)
    .limit(limit)
}

async function saveLaunch(launch) {
    await launches.updateOne({
        flightNumber: launch.flightNumber
    }, launch, {
        upsert: true
    })
}

async function scheduleNewLaunch(launch) {
    const planet = await planets.findOne({keplerName: launch.target})

    if (!planet) { 
        throw new Error('No matching planet was found')
    }

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
    loadLaunchData,
    getAllLaunches,
    scheduleNewLaunch,
    abortLaunch
}