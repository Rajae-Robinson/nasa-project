require('dotenv').config();

const http = require('http')

const app = require('./app')
const { mongoConnect } = require('./services/mongo')

const { loadPlanetsData } = require('./models/planets-model') 

const PORT = process.env.PORT || 3001
const server = http.createServer(app)

async function loadServerData() {
    await mongoConnect()
    await loadPlanetsData()
    server.listen(PORT, () => {
        console.log(`Listening on port ${PORT}...`)
    });
}

loadServerData()                                                                                                                                            