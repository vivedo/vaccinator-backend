const jwt = require('jsonwebtoken')

module.exports.JWT_SALT = 'noncen\'ècoviddi'

module.exports.sign = jwt.sign;