
const dotenv = require('dotenv');
const mongoose = require('mongoose')

const http = require('http')

const app = require('./app')

const { loadPlanetsData } = require('./models/planets-model') 

dotenv.config({ path: './config.env' });
const PORT = process.env.PORT || 3001;
const server = http.createServer(app)

const DB = process.env.DB_CONNECTION_STRING;

mongoose.connection.once('open', () => {
    console.log('Mongo connection established.')
})

mongoose.connection.on('error', (err) => {
    console.error(err)
})

async function loadServerData() {
    await mongoose.connect(DB)
    await loadPlanetsData()
    server.listen(PORT, () => {
        console.log(`Listening on port ${PORT}...`)
    });
}

loadServerData()                                                                                                                                            