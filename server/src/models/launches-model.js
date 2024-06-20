const axios = require('axios')

const launches = require('./launches-mongo')
const planets = require('./planets-mongo');
const { logger } = require('../utils/logger');

DEFAULT_FLIGHT_NUMBER = 100

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';

async function populateLaunches() {
    const response = await axios.post(SPACEX_API_URL, {
      query: {},
      options: {
        pagination: false,
        populate: [
          {
            path: 'rocket',
            select: {
              name: 1
            }
          },
          {
            path: 'payloads',
            select: {
              'customers': 1
            }
          }
        ]
      }
    })
  
    if (response.status !== 200) {
      throw new Error('Launch data download failed');
    }
  
    const launchDocs = response.data.docs;
    for (const launchDoc of launchDocs) {
      const payloads = launchDoc['payloads'];
      const customers = payloads.flatMap((payload) => {
        return payload['customers'];
      });
  
      const launch = {
        flightNumber: launchDoc['flight_number'],
        mission: launchDoc['name'],
        rocket: launchDoc['rocket']['name'],
        launchDate: launchDoc['date_local'],
        upcoming: launchDoc['upcoming'],
        success: launchDoc['success'],
        customers,
      };
  
      await saveLaunch(launch);
    }
}

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