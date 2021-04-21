const {PdfReader, TableParser} = require('pdfreader')

let table = new TableParser()
function itemHandler (item, cb) {
    const entries = []
    const cfRegex = /^[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]$/i
    let cfCount = 0

    if (!item || item.page) {
        let res = table
            .getMatrix()
            .map(entry => entry[0].map(k => k.text))
            .map(entry => entry.length > 4 ? entry : (() => {entry.splice(2, 0, null); return entry})())
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
        if(cfRegex.test(item.text))
            cfCount++

        table.processItem(item, item)
    }

    if(!item)
        if(entries.length < cfCount)
            cb('Something went lost during parsing!', null)
        else {
            entries.sort((a, b) => a.date > b.date ? 1 : -1)
            cb(null, entries)
        }
}

module.exports.parseReport = (file) => new Promise((res, rej) => {
    new PdfReader().parseFileItems(file, (err, item) => {
        if(err) return rej(err)

        itemHandler(item, (err, entries) => {
            if(err) return rej(err)
            res(entries)
        })
    });
})

module.exports.parseReportBuffer = (buffer) => new Promise((res, rej) => {
    new PdfReader().parseBuffer(buffer, (err, item) => {
        if(err) return rej(err)

        itemHandler(item, (err, entries) => {
            if(err) return rej(err)
            res(entries)
        })
    });
})