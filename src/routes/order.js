const express = require('express')
const order = require('../controllers/order')
const bodyParser = require('body-parser')
const authorize = require('../controllers/auth')
const app = express()

app.use(bodyParser.json())

app.get('/', authorize.authorize, order.getAllOrder)
app.post('/', order.Createorder)

module.exports = app