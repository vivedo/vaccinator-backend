const { Pool } = require('pg')
const format = require('pg-format')

const pool = new Pool({
    user: 'vaccinator',
    host: 'localhost',
    database: 'vaccinator',
    password: 'vaccinator',
    port: 5432,
})

module.exports.pool = pool;

module.exports.format = format;