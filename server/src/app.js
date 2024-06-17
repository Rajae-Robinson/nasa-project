const path = require('path')

const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const { rateLimit } = require('express-rate-limit')
const v1API = require('./routes/v1')

const app = express()

app.set('trust proxy', 1)

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 100, 
	standardHeaders: true, 
	legacyHeaders: false,
})

// diasble helmet until SSL setup on prod
// app.use(helmet())

app.use(cors({
    origin: 'http://localhost:3000'
}))

app.use(limiter)

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))

app.use(express.json())

app.use(express.static(path.join(__dirname, '../public')))

app.use('/v1', v1API)

app.get('/x-forwarded-for', (request, response) => response.send(request.headers['x-forwarded-for']))

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'))
})

module.exports = app