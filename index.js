const express = require('express');
const fileUpload = require('express-fileupload')
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(morgan('dev'))
app.use(fileUpload({
    createParentPath: true
}))


app.use(require('./routes/uploadreport'))
app.use(require('./routes/listings'))
app.use(require('./routes/auth'))

app.get('/', (req, res) => {
    res.send({status: true, message: 'Welcome to Vaccinator API'})
})

const port = process.env.PORT || 3200;

app.listen(port, () =>
    console.log(`App is listening on port ${port}.`)
);
