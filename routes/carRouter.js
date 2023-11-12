const express = require("express")
const router = express.Router()
const carController = require("../controllers/carController")

// Get all cars data
router.get("/", carController.getCarsData)

module.exports = router
