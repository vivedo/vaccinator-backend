const {PdfReader, TableParser} = require('pdfreader')

/**
 *
 * @returns a function that parses items from pdfreader and call the cb when the parsing is over or finds an error
 */
function getItemHandler () {
    const entries = []
    const cfRegex = /^[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]$/i
    let cfCount = 0
    let table = new TableParser()

    return function(item, cb) {
        if (!item || item.page) {
            let res = table
                // get table matrix
                .getMatrix()

                // discard everything but the content
                .map(entry => entry[0].map(k => k.text))

                // add field where name cell is empty
                .map(entry => entry.length > 4 ? entry : (() => {entry.splice(2, 0, null); return entry})())

                // filter for exact entries
                .filter(entry => entry.length === 5)
                .map(entry => ({
                    date: entry[0],
                    code: entry[1],
                    name: entry[2],
                    fc: entry[3],
                    phone: entry[4]
                }))

            entries.push(...res)

            table = new TableParser()
        } else if (item.text){

            // count cf to prevent data loss during parsing
            if(cfRegex.test(item.text)) {
                cfCount++
            }

            table.processItem(item, item)
        }

        if(!item)
            if(entries.length !== cfCount)
                cb(`Something went lost during parsing! (${entries.length} entries found and ${cfCount} CFs)`, null)
            else {
                entries.sort((a, b) => a.date > b.date ? 1 : -1) // sort by date
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