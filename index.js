const express = require('express')
const cors = require("cors")
const routes = require('./routes')

const app = express()

// To help with accessing this server
app.use(cors())

app.use((req, res, next) => {
  const { headers } = req
  const customDomain = headers.host && headers.host.endsWith(process.env.NEXT_PUBLIC_DOMAIN)
  if (customDomain) {
    req.url = req.url.replace('/api.localhost.com', '')
  }
  next()
})

//Use routes
app.use(routes)

app.listen(9312, () => {
  console.log(`Server is running at http://localhost:9312`)
})