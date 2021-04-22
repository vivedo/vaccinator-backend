const {PdfReader, TableParser} = require('pdfreader')

/**
 *
 * @returns a function that parses items from pdfreader and call the cb when the parsing is over or finds an error
 */
function getItemHandler () {
    const cfRegex = /^[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]$/i
    const dateRegex = /(\d{2}\/\d{2}\/\d{4} \d{2}:\d{2})/
    const phoneRegex = /\d{9,10}/
    const charRegex = /[a-z]+ +[a-z]+/i
    const codeRegex = /[a-z]{2} ?\d{3,5}/i

    const entries = []
    let table = new TableParser()

    return function(item, cb) {
        if (!item || item.page) {
            let res = table
                // get table matrix
                .getMatrix()

                // discard everything but the content
                .map(entry => entry[0].map(k => k.text))

                // filter for exact entries
                .filter(entry => entry.filter(field => cfRegex.test(field)).length > 0)

                .map(entry => ({
                    fc    : entry.find(k =>    cfRegex.test(k)),
                    date  : entry.find(k =>  dateRegex.test(k)) || '',
                    phone : entry.find(k => phoneRegex.test(k)) || '',
                    name  : entry.find(k =>  charRegex.test(k)) || '',
                    code  : entry.find(k =>  codeRegex.test(k)) || ''
                }))

            entries.push(...res)

            table = new TableParser()
        } else if (item.text){

            table.processItem(item, item)
        }


        if(!item) {
            cb(null, entries)
        }
    }
}

module.exports.parseReport = (file) => new Promise((res, rej) => {
    const itemHandler = getItemHandler()
    new PdfReader().parseFileItems(file, (err, item) => {
        if(err) return rej(err)

        itemHandler(item, (err, entries) => {
            if(err) return rej(err)
            res(entries)
        })
    })
})

module.exports.parseReportBuffer = (buffer) => new Promise((res, rej) => {
    const itemHandler = getItemHandler()
    new PdfReader().parseBuffer(buffer, (err, item) => {
        if(err) return rej(err)

        itemHandler(item, (err, entries) => {
            if(err) return rej(err)
            res(entries)
        })
    })
})

module.exports.parseReport('data/newreport.pdf')
.then(res => {
    console.log(JSON.stringify(res, null, 2))
})
.catch(err => {
    console.error(err)
})