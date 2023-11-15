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

// Get the filter information of the corresponding car based on make and family
function getCarFilterInformation(make, family) {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM Car WHERE Make = ? AND Model = ?;`
    const values = [make, family]
    pool.query(query, values, function (error, results, fields) {
      if (error) {
        reject(error)
      } else {
        resolve(results)
      }
    })
  })
}

// Get eligible cars based on filters
function getCarsBasedOnFilter(columns, values) {
  return new Promise((resolve, reject) => {
    let conditions = ""
    let offset = ""
    let sortBy = ""
    let orderBy = ""
    let removeValueIndex = []
    for (let i = 0; i < columns.length; i++) {
      if (columns[i] === "page") {
        offset = ` OFFSET ${10 * (values[i] - 1)};`
        removeValueIndex.push(i)
        continue
      }
      else if (columns[i] === "sortBy") {
        let sortByColumn = ""
        if (values[i] === "" || values[i] === "Sold Date") {
          sortByColumn = "Sold_Date"
        }
        else if (values[i] === "Age") {
          sortByColumn = "Age_Comp_Months"
        }
        else if (values[i] === "Odometer") {
          sortByColumn = "Odometer"
        }
        removeValueIndex.push(i)
        sortBy = ` ORDER BY ${sortByColumn}`
        continue
      }
      else if (columns[i] === "orderBy") {
        if (values[i] === "" || values[i] === "Asc") {
          orderBy = " ASC"
        }
        else if (values[i] === "Desc") {
          orderBy = " DESC"
        }
        removeValueIndex.push(i)
        continue
      }
      else if (columns[i].includes("_")) {
        if (columns[i] === "min_year") {
          conditions += " YearGroup BETWEEN ? AND ?"
        } else if (columns[i] === "min_odometer") {
          conditions += " Odometer BETWEEN ? AND ?"
        } else if (columns[i] === "min_sold_date") {
          conditions += " Sold_Date BETWEEN ? AND ?"
          if (i === columns.length - 2) {
            continue
          }
        } else {
          continue
        }
      } else if (columns[i] === "keyword") {
        conditions += ` Description LIKE ?`
        values[i] = `%${values[i]}%`
      } else if (columns[i] === "Branch") {
        conditions += ` Branch LIKE ?`
        values[i] = `%${values[i]}%`
      } else {
        conditions += ` ${columns[i]} = ?`
      }
      conditions += i < columns.length - 1 ? ' AND' : ''
    }

    for (let i = removeValueIndex.length - 1; i >= 0; i--) {
      let index = removeValueIndex[i]
      if (index >= 0 && index < values.length) {
        values.splice(index, 1)
      }
    }

    const query = `SELECT * FROM Car WHERE${conditions}${sortBy}${orderBy} LIMIT 10${offset}`
    pool.query(query, values, function (error, results, fields) {
      if (error) {
        reject(error)
      } else {
        resolve(results)
      }
    })
  })
}

// Get eligible cars state based on filters
function getCarsStatsBasedOnFilter(columns, values) {
  return new Promise((resolve, reject) => {
    let conditions = ""
    for (let i = 0; i < columns.length; i++) {
      if (columns[i] === "page" || columns[i] === "orderBy" || columns[i] === "sortBy") {
        continue
      } else if (columns[i].includes("_")) {
        if (columns[i] === "min_year") {
          conditions += " YearGroup BETWEEN ? AND ?"
        } else if (columns[i] === "min_odometer") {
          conditions += " Odometer BETWEEN ? AND ?"
        } else if (columns[i] === "min_sold_date") {
          conditions += " Sold_Date BETWEEN ? AND ?"
          if (i === columns.length - 2) {
            continue
          }
        } else {
          continue
        }
      } else if (columns[i] === "keyword") {
        conditions += ` Description LIKE ?`
      } else {
        conditions += ` ${columns[i]} = ?`
      }
      conditions += i < columns.length - 1 ? ' AND' : ''
    }
    const query = `SELECT COUNT(*) AS total, AVG(Odometer) AS avgKm, AVG(Age_Comp_Months) AS avgAge FROM Car WHERE${conditions}`
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
  getCarFamilies,
  getCarFilterInformation,
  getCarsBasedOnFilter,
  getCarsStatsBasedOnFilter
}
