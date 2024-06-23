const launches = require('./launches-schema')
const planets = require('../planets/planets-schema');
const { populateLaunches } = require('../../services/spacex-launch-data-service');
const { saveLaunch, findLaunch } = require('../../services/launch-service')
const { logger } = require('../../utils/logger');
const AppError = require('../../utils/app-error');

const DEFAULT_FLIGHT_NUMBER = 100

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
  try {
    const sortOption = sort === 'desc' ? -1 : 1;
    return await launches.find({}, { '_id': 0, '__v': 0 })
        .sort({ flightNumber: sortOption })
        .skip(skip)
        .limit(limit);
  } catch (error) {
      logger.error('Error getting all launches:', error);
      throw error;
  }
}

async function scheduleNewLaunch(launch) {
    const planet = await planets.findOne({keplerName: launch.target})

    if (!planet) { 
      throw new AppError('No matching planet was found', 400)
    }

    const newFlightNumber = await getLatestFlightNumber() + 1

    const newLaunch = Object.assign(launch, {
        success: true,
        upcoming: true,
        customers: ['ZTM', 'NASA'],
        flightNumber: newFlightNumber
    })

    try {
      await saveLaunch(newLaunch)
    } catch(err) {
      throw err
    }   
}

async function abortLaunch(id) {
    const launch = await launches.findOne({flightNumber: id})

    if(!launch) throw new AppError(`Launch with flight number ${id} not found`, 404)

    launch.upcoming = false
    launch.success = false

    try {
        await launch.save()
    } catch(err) {
      throw err
    }
}

module.exports = {
    loadLaunchData,
    getAllLaunches,
    scheduleNewLaunch,
    abortLaunch
}