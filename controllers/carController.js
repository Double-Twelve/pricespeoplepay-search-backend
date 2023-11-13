const carModel = require("../models/carModel")

// Get all cars data
async function getCarsData(req, res, next) {
  try {
    const data = await carModel.getCars()
    res.json({ data })
  } catch (error) {
    next(error)
  }
}

// Get all the families corresponding to the car based on its make
async function getCarFamiliesData(req, res, next) {
  try {
    const make = req.query.make
    const data = await carModel.getCarFamilies(make)
    const result = data.map(item => item.Model)
    res.json({ data: result })
  } catch (error) {
    next(error)
  }
}

// Get the filter information of the corresponding car based on make and family
async function getCarFilterInformationData(req, res, next) {
  try {
    const make = req.query.make
    const family = req.query.family
    const data = await carModel.getCarFilterInformation(make, family)
    let min_year = 0, max_year = 0, min_odometer = 0, max_odometer = 0
    let min_sold_date = "", max_sold_date = ""
    let fuelType = [], saleCategory = [], transmissionType = [], stateType = [], badge = [], bodyFilter = [], driveDescription = [], engineDescription = [], NVIC = [], division = []
    let seatFilter = [4, 5]
    let bodyConfigDescription = ["(Blank)"]
    let doorNum = [2, 3, 4, 5]
    let cylinders = [3, 4, 6]

    data.forEach(item => {
      if (min_year === 0 && max_year === 0) {
        min_year = item.YearGroup
        max_year = item.YearGroup
      } else {
        if (item.YearGroup < min_year) {
          min_year = item.YearGroup
        }
        if (item.YearGroup > max_year) {
          max_year = item.YearGroup
        }
      }

      if (item.FuelTypeDescription && !fuelType.includes(item.FuelTypeDescription)) {
        fuelType.push(item.FuelTypeDescription)
      }

      if (min_odometer === 0 && max_odometer === 0) {
        min_odometer = item.Odometer
        max_odometer = item.Odometer
      } else {
        if (item.Odometer < min_odometer) {
          min_odometer = item.Odometer
        }
        if (item.Odometer > max_odometer) {
          max_odometer = item.Odometer
        }
      }

      if (item.SaleCategory && !saleCategory.includes(item.SaleCategory)) {
        saleCategory.push(item.SaleCategory)
      }

      if (item.GearTypeDescription && !transmissionType.includes(item.GearTypeDescription)) {
        transmissionType.push(item.GearTypeDescription)
      }

      const stateMatch = item.Branch.match(/\(([^)]+)\)/)
      const state = stateMatch && stateMatch[1]
      if (!stateType.includes(state)) {
        stateType.push(state)
      }

      if (item.BadgeDescription && !badge.includes(item.BadgeDescription)) {
        badge.push(item.BadgeDescription)
      }

      if (item.BodyStyleDescription && !bodyFilter.includes(item.BodyStyleDescription)) {
        bodyFilter.push(item.BodyStyleDescription)
      }

      if (item.drivedescription && !driveDescription.includes(item.drivedescription)) {
        driveDescription.push(item.drivedescription)
      }

      if (item.EngineDescription && !engineDescription.includes(item.EngineDescription)) {
        engineDescription.push(item.EngineDescription)
      }

      if (min_sold_date === "" && max_sold_date === "") {
        min_sold_date = item.Sold_Date
        max_sold_date = item.Sold_Date
      } else {
        let date = new Date(item.Sold_Date)
        let minDate = new Date(min_sold_date)
        let maxDate = new Date(max_sold_date)
        if (date < minDate) {
          min_sold_date = item.Sold_Date
        }
        if (date > maxDate) {
          max_sold_date = item.Sold_Date
        }
      }

      if (item.Division && !division.includes(item.Division)) {
        division.push(item.Division)
      }
    })
    res.json({ data: { min_year, max_year, fuelType, min_odometer, max_odometer, saleCategory, transmissionType, stateType, badge, bodyFilter, seatFilter, driveDescription, engineDescription, min_sold_date, max_sold_date, NVIC, division, bodyConfigDescription, doorNum, cylinders } })
  } catch (error) {
    next(error)
  }
}

// Get eligible cars based on filters
async function getCarsBasedOnFilterData(req, res, next) {
  try {
    const queryParams = req.query
    const columns = Object.keys(queryParams)
    const values = Object.values(queryParams)
    const carData = await carModel.getCarsBasedOnFilter(columns, values)
    const carStatsData = await carModel.getCarsStatsBasedOnFilter(columns, values)
    carStatsData[0].make = req.query.Make
    carStatsData[0].family = req.query.Model
    res.json({ carData, carStatsData })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getCarsData,
  getCarFamiliesData,
  getCarFilterInformationData,
  getCarsBasedOnFilterData
}