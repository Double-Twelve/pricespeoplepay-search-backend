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

module.exports = {
  getCars
}
