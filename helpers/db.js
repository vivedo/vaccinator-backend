const { Pool } = require('pg')
const format = require('pg-format')

const pool = new Pool({
    user: 'vaccinator',
    host: 'db',
    database: 'vaccinator',
    password: 'vaccinator',
    port: 5432,
    application_name: 'vaccinator_node_backend'
})

module.exports.pool = pool;

module.exports.format = format;