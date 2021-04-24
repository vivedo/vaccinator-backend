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

            const client = await pool.connect()

            try {
                await client.query('BEGIN')

                let dbres = await client.query(
                    'INSERT INTO listings (user_id, listing_name) VALUES ($1, $2) RETURNING listing_id', [req.user.id, listing])

                const {listing_id} = dbres.rows[0]
                const entriesData = entries.map(e => ([listing_id, e.date, e.name, e.fc, e.code, e.phone]))

                await client.query(
                    format('INSERT INTO entries (listing_id, entry_date, name, fc, code, phone) VALUES %L', entriesData))

                await client.query('COMMIT')

                res.send({
                    status: true,
                    message: 'UPLOAD_SUCCESSFUL'
                })
            } catch (err) {
                await client.query('ROLLBACK')
                throw err
            } finally {
                client.release()
            }
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