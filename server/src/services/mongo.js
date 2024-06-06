const mongoose = require('mongoose')

require('dotenv').config();

// DEV database
const DB = process.env.DB_CONNECTION_STRING;

mongoose.connection.on('error', (err) => {
    console.error(err)
})

async function mongoConnect() {
    await mongoose.connect(DB)
}

async function mongoDisconnect() {
    await mongoose.disconnect()
}

module.exports = {
    mongoConnect,
    mongoDisconnect
}