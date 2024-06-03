const path = require('path')

const dotenv = require('dotenv');
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')


const planetsRouter = require('./routes/planets/planets-router')
const launchesRouter = require('./routes/launches/launches-router')

const app = express()
dotenv.config({ path: './config.env' });

app.use(cors({
    origin: 'http://localhost:3000'
}))

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))

app.use(express.json())

app.use(express.static(path.join(__dirname, '../public')))

app.use('/planets', planetsRouter)
app.use('/launches', launchesRouter)

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'))
})

module.exports = app