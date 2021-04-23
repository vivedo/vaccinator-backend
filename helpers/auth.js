const jwt = require('jsonwebtoken')

const SECRET_KEY = 'noncen\'ècoviddi'

module.exports.sign = (payload) => jwt.sign(payload, SECRET_KEY);

module.exports.verify = (token) => jwt.verify(token, SECRET_KEY)