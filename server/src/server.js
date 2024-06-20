require('dotenv').config();

const http = require('http')

const app = require('./app')
const { mongoConnect } = require('./config/mongo')

const { loadPlanetsData } = require('./models/planets-model'); 
const { loadLaunchData } = require('./models/launches-model');
const { logger, errorLogger } = require('./utils/logger');

const PORT = process.env.PORT || 3001
const server = http.createServer(app)

process.on("uncaughtException", (err) => {
    errorLogger.error(`Uncaught Exception: ${err.message}`, { stack: err.stack });
    errorLogger.warn("Closing server now...");
    server.close(() => {
        process.exitCode = 1;
    })
});

async function loadServerData() {
    await mongoConnect()
    await loadPlanetsData()
    await loadLaunchData()
    server.listen(PORT, () => {
        logger.info(`Listening on port ${PORT}...`)
    });
}

loadServerData() 

process.on("unhandledRejection", (err) => {
    errorLogger.error(`Unhandled Rejection: ${err.message}`, { stack: err.stack });
    errorLogger.warn("Closing server now...");
    server.close(() => {
        process.exitCode = 1;
    })

});

process.on("SIGTERM", () => {
    errorLogger.error("SIGTERM received. Shutting down gracefully");
    errorLogger.warn("Closed out remaining connections",);
    server.close(() => {
        process.exitCode = 0;
    });
});