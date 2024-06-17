const path = require('path')
const fs = require('fs');
const { parse } = require('csv-parse');

const planets = require('./planets-mongo');
const { logger } = require('../services/logger');

function isHabitablePlanet(planet) {
  return planet['koi_disposition'] === 'CONFIRMED'
    && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
    && planet['koi_prad'] < 1.6;
}

function loadPlanetsData() {
    return new Promise((resolve, reject) => { 
        fs.createReadStream(path.join(__dirname, '..', '..', 'data/kepler_data.csv'))
      .pipe(parse({
        comment: '#',
        columns: true,
      }))
      .on('data', (data) => {
        if (isHabitablePlanet(data)) {
          savePlanet(data)
        }
      })
      .on('error', (err) => {
        console.log(err);
      })
      .on('end', async () => {
        const planetsCount = (await getAllPlanets()).length
        logger.info(`${planetsCount} habitable planets found!`)
        resolve()
      })})
}

async function getAllPlanets() {
  return await planets.find({}, { _id: 0, __v: 0 })
}

async function savePlanet(planet) {
  try {
    await planets.updateOne({
      keplerName: planet.kepler_name,
    }, {
      keplerName: planet.kepler
    }, {
      upsert: true
    })
  } catch(err) {
    console.error(`Could not save planet: ${err}`)
  }
}

module.exports = {
    loadPlanetsData,
    getAllPlanets,
}
