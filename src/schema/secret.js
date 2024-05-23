const dotenv = require('dotenv')

dotenv.config({path:'.env'})

exports.PORT = process.env

exports.JWT_SECRET = process.env.JWT_SECRET