const express = require("express")
const router = express.Router()
const carController = require("../controllers/carController")

// Get all cars data
router.get("/", carController.getCarsData)

// Get all the families corresponding to the car based on its make
router.get("/family", carController.getCarFamiliesData)

// Get the filter information of the corresponding car based on make and family
router.get("/filter-information", carController.getCarFilterInformationData)

module.exports = router
