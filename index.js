const express = require('express')
const cors = require("cors")
//const routes = require('./routes')

const app = express()

// To help with accessing this server
app.use(cors())

// Use routes
//app.use(routes)


app.use((req, res, next) => {
  const { headers } = req

  // 检查是否有自定义域名
  const customDomain = headers.host && headers.host.endsWith('localhost.com')

  if (customDomain) {
    // 处理自定义域名
    req.url = req.url.replace('/api.localhost.com', '')
  }

  next()
})

const router = express.Router()
router.get('/car', (req, res) => {
  // 这里可以查询数据库或者提供静态数据
  const carList = [
    { id: 1, make: 'Toyota', model: 'Camry' },
    { id: 2, make: 'Honda', model: 'Civic' },
  ]

  // 将车辆列表作为 JSON 发送到客户端
  res.json(carList)
})
app.use(router)

app.listen(9312, () => {
  console.log(`Server is running at http://localhost:9312`)
})