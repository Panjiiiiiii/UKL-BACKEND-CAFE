const express = require('express')
const coffee = require('../controllers/coffee')
const bodyParser = require('body-parser')
const authorize = require('../controllers/auth')
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

app.get("/", coffee.getMenu)
app.get("/:search", coffee.findMenu)
app.get("/image/:filename", coffee.getFoodImage)
app.post("/", authorize.authorize, coffee.addMenu)
app.put("/:id", authorize.authorize ,coffee.updateMenu)
app.delete("/:id", authorize.authorize ,coffee.deleteMenu)

module.exports = app