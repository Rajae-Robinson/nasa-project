const mongoose = require('mongoose')

require('dotenv').config();

const { loadPlanetsData } = require('../models/planets/planets-model');
const { logger, errorLogger } = require('../utils/logger');

const DB = process.env.DB_CONNECTION_STRING;
const TEST_DB = process.env.TEST_DB_CONNECTION_STRING;

mongoose.connection.on('error', (err) => {
    errorLogger.error(err)
})

async function mongoConnect() {
    await mongoose.connect(DB)
    logger.info('MongoDB successfully connected')
}

async function mongoConnectTestDB() {
    await mongoose.connect(TEST_DB)
    await loadPlanetsData()
}

async function mongoDisconnect() {
    await mongoose.disconnect()
    logger.info('MongoDB successfully disconnected')
}

module.exports = {
    mongoConnect,
    mongoConnectTestDB,
    mongoDisconnect
}