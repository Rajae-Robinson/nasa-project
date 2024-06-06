const mongoose = require('mongoose')

require('dotenv').config();

const { loadPlanetsData } = require('../models/planets-model')

const DB = process.env.DB_CONNECTION_STRING;
const TEST_DB = process.env.TEST_DB_CONNECTION_STRING;

mongoose.connection.on('error', (err) => {
    console.error(err)
})

async function mongoConnect() {
    await mongoose.connect(DB)
}

async function mongoConnectTestDB() {
    await mongoose.connect(TEST_DB)
    await loadPlanetsData()
}

async function mongoDisconnect() {
    await mongoose.disconnect()
}

module.exports = {
    mongoConnect,
    mongoConnectTestDB,
    mongoDisconnect
}