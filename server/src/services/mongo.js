const dotenv = require('dotenv');
const mongoose = require('mongoose')

dotenv.config({ path: './config.env' });

// DEV database
const DB = process.env.DB_CONNECTION_STRING;

mongoose.connection.once('open', () => {
    console.log('Mongo connection established.')
})

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