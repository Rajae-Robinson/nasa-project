const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const { morganMiddleware } = require('./utils/logger');
const v1API = require('./routes/v1');
const {limiter} = require('./middlewares/rate-limit');
const sanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')
const AppError = require('./utils/app-error');
const globalErrorHandler = require('./utils/global-error');

const app = express();

app.use(helmet())

app.use(cors({
    origin: 'http://localhost:3000'
}));

app.use(limiter);

app.use(morganMiddleware);

app.use(express.json());

// Data sanitization against NoSQL query injection attack
app.use(sanitize());

// Data sanitization against XSS
app.use(xss());

// prevent parameter pollution
app.use(hpp())

app.use(express.static(path.join(__dirname, '../public')));

app.use('/v1', v1API);

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.url} on this server`, 404))
})

app.use(globalErrorHandler)

module.exports = app;
