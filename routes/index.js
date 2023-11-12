const express = require('express')
const router = express.Router()
const car = require('./carRouter')

// Route requests with the '/car' prefix to car related routes
router.use("/car", car)

module.exports = router