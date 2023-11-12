require('dotenv').config()
const mysql = require('mysql')

const pool = mysql.createPool(process.env.NEXT_PUBLIC_DATABASE_URL)

module.exports = pool