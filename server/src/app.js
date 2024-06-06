const path = require('path')

const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const v1API = require('./routes/v1')

const app = express()

app.use(helmet())

app.use(cors({
    origin: 'http://localhost:3000'
}))

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))

app.use(express.json())

app.use(express.static(path.join(__dirname, '../public')))

app.use('/v1', v1API)

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'))
})

module.exports = app