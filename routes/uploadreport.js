const router = require('express').Router()
const {parseReportBuffer} = require('../helpers/reportparser')
const {pool, format} = require('../helpers/db')

router.post('/upload-report', async (req, res) => {
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
        res.send({
            status: true,
            message: 'Upload successful'
        })

        const {report} = req.files;
        const {listing} = req.body;
        const entries = await parseReportBuffer(report.data)
        const user_id = 1; // TODO: grab from session

        let dbres = await pool.query(
            'INSERT INTO listings (user_id, listing_name) VALUES ($1, $2) RETURNING listing_id', [user_id, listing])

        const {listing_id} = dbres.rows[0]
        const entriesData = entries.map(e => ([listing_id, e.date, e.name, e.fc, e.code, e.phone]))

        dbres = await pool.query(
            format('INSERT INTO entries (listing_id, entry_date, name, fc, code, phone) VALUES %L', entriesData))

        console.log(dbres);
    }
})

module.exports = router