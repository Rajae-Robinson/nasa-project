const { getAllPlanets } = require('../../models/planets/planets-model')
const catchAsync = require("../../utils/catch-async")

async function httpGetAllPlanets(req, res) {
    return res.status(200).json(await getAllPlanets())
}

module.exports = {
    httpGetAllPlanets: catchAsync(httpGetAllPlanets)
}