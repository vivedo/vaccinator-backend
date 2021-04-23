const {ensureAuth} = require("../middlewares/authMiddleware");
const router = require('express').Router()
const {pool} = require('../helpers/db')

router.get('/listings/stats', ensureAuth, async (req, res) => {
    let stats = await pool.query('SELECT COUNT(*) AS entries, COUNT(CASE scanned WHEN 1::bit THEN 1 ELSE null end) AS scanned FROM entries WHERE listing_id IN (SELECT listing_id FROM listings WHERE user_id = $1)', [req.user.id])

    res.send({
        status: true,
        data: stats.rows[0]
    })
})

router.get('/listings', ensureAuth, async (req, res) => {
    let listings = await pool.query('SELECT * FROM listings WHERE user_id = $1 ORDER BY insertion_date DESC', [req.user.id])

    res.send({
        status: true,
        data: listings.rows
    })
})

router.get('/listings/:listing_id', ensureAuth, async (req, res) => {
    let entries = await pool.query('SELECT * FROM listings WHERE listing_id = $1', [req.params.listing_id])

    res.send({
        status: true,
        data: entries.rows[0]
    })
})

router.get('/listings/:listing_id/entries', ensureAuth, async (req, res) => {
    let entries = await pool.query('SELECT * FROM entries WHERE listing_id = $1 ORDER BY entry_date', [req.params.listing_id])

    res.send({
        status: true,
        data: entries.rows
    })
})

router.post('/entries/:entry_id/scan', ensureAuth, async (req, res) => {
    await pool.query('UPDATE entries SET scanned = 1::bit WHERE entry_id = $1', [req.params.entry_id])

    // TODO: check if entry is part of a listing owned by user (expand where clause)

    res.send({
        status: true,
        data: 'OK'
    })
})

module.exports = router