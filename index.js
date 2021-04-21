const {parseReport} = require('./reportparser')

parseReport('data/report.pdf')
    .then(res => console.log(JSON.stringify(res, null, 2)))
