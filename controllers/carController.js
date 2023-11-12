const carModel = require("../models/carModel")

// Get all cars data
async function getCarsData(req, res, next) {
  try {
    const data = await carModel.getCars()
    res.json(data)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getCarsData
}