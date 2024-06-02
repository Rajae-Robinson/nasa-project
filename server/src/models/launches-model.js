const launches = new Map();

// const DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
    flightNumber: 100,
    mission: 'Kepler Exploration X',
    rocket: 'Explorer IS1',
    launchDate: new Date('December 27, 2030'),
    target: 'Kepler-442 b',
    customer: ['ZTM', 'NASA'],
    upcoming: true,
    success: true,
}

launches.set(launch.flightNumber, launch)

function getAllLaunches() {
    return Array.from(launches.values())
}

function addNewLaunch() {
    launches.set(launch.flightNumber)
}

function abortLaunch(id) {
    const launch = launches.get(id)
    console.log("launch", launch)
    launch.upcoming = false
    launch.success = false
    return launch
}

module.exports = {
    getAllLaunches,
    abortLaunch
}