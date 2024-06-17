const path = require('path')
const fs = require('fs')

const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const { rateLimit } = require('express-rate-limit')
var rfs = require('rotating-file-stream')

const v1API = require('./routes/v1')

const app = express()

app.set('trust proxy', 1);

const logDirectory = path.join(__dirname, 'log');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

var accessLogStream = rfs.createStream('access.log', {
    size: '10M',
    interval: '1d', 
    path: logDirectory
})

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

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined', { stream: accessLogStream }));
}

app.use(express.json())

app.use(express.static(path.join(__dirname, '../public')))

app.get('/ip', (request, response) => response.send(request.ip))
app.get('/x-forwarded-for', (request, response) => response.send(request.headers['x-forwarded-for']))

app.use('/v1', v1API)

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'))
})

module.exports = app