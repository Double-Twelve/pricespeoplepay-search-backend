const pool = require("../config/dbconfig")

// Get all cars data
function getCars() {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM Car;`
    pool.query(query, function (error, results, fields) {
      if (error) {
        reject(error)
      } else {
        resolve(results)
      }
    })
  })
}

// Get all the families corresponding to the car based on its make
function getCarFamilies(make) {
  return new Promise((resolve, reject) => {
    const query = `SELECT DISTINCT Model FROM Car WHERE Make = ? ORDER BY Model ASC;`
    const values = [make]
    pool.query(query, values, function (error, results, fields) {
      if (error) {
        reject(error)
      } else {
        resolve(results)
      }
    })
  })
}

module.exports = {
  getCars,
  getCarFamilies
}
