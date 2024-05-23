const express = require('express')
const auth = require('../controllers/auth')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.json())

app.post("/signup", auth.signUp)
app.post("/auth", auth.login)

module.exports = app