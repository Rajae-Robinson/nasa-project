const launches = require('../models/launches/launches-schema')

async function findLaunch(filter) {
    try {
        return await launches.findOne(filter);
    } catch (error) {
        logger.error('Error finding launch:', error);
        throw error;
    }
}
  
async function saveLaunch(launch) {
    await launches.updateOne({
        flightNumber: launch.flightNumber
    }, launch, {
        upsert: true
    })
}

module.exports = {
    findLaunch,
    saveLaunch
}