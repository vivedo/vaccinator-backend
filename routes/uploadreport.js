const {ensureAuth} = require("../middlewares/authMiddleware");
const router = require('express').Router()
const {parseReportBuffer} = require('../helpers/reportparser')
const {pool, format} = require('../helpers/db')

router.post('/upload-report', ensureAuth, async (req, res) => {
    if(!req.files || !req.files.report) {
        res.send({
            status: false,
            message: 'Missing report file'
        })
    } else if(!req.body || !req.body.listing) {
        res.send({
            status: false,
            message: 'Missing listing name'
        })
    } else {
        try {
            const {report} = req.files;
            const {listing} = req.body;
            const entries = await parseReportBuffer(report.data)

            let dbres = await pool.query(
                'INSERT INTO listings (user_id, listing_name) VALUES ($1, $2) RETURNING listing_id', [req.user.id, listing])

            const {listing_id} = dbres.rows[0]
            const entriesData = entries.map(e => ([listing_id, e.date, e.name, e.fc, e.code, e.phone]))

            dbres = await pool.query(
                format('INSERT INTO entries (listing_id, entry_date, name, fc, code, phone) VALUES %L', entriesData))

            res.send({
                status: true,
                message: 'Upload successful'
            })
        } catch(err) {
            console.log(err)
            res.send({
                status: false,
                message: 'INSERNAL_ERROR'
            })
        }
    }
})

module.exports = router