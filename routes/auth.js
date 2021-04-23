const auth = require("../helpers/auth");
const router = require('express').Router()
const {pool, format} = require('../helpers/db')

router.post('/login', async (req, res) => {
    let dbres = await pool.query('SELECT user_id, username FROM users WHERE username = $1 AND password = $2', [req.body.username, req.body.password])

    if(!dbres.rows.length)
        return res.send({
            status: false,
            message: 'Login failed'
        })

    res.send({
        status: true,
        data: {
            user_id: dbres.rows[0].user_id,
            username: dbres.rows[0].username,
            token: auth.sign({id: dbres.rows[0].user_id})
        }
    })

})

module.exports = router