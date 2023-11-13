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

// Get all the families corresponding to the car based on its make
async function getCarFamiliesData(req, res, next) {
  try {
    const make = req.query.make
    console.log(make)
    const data = await carModel.getCarFamilies(make)
    res.json(data)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getCarsData,
  getCarFamiliesData
}