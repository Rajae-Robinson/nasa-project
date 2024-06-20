const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const { morganMiddleware } = require('./utils/logger');
const v1API = require('./routes/v1');
const limiter = require('./middlewares/rate-limit');
const AppError = require('./utils/app-error');
const globalErrorHandler = require('./utils/global-error');

const app = express();

// TODO:
//app.use(helmet())

app.use(cors({
    origin: 'http://localhost:3000'
}));

app.use(limiter);

app.use(morganMiddleware);

app.use(express.json());

app.use(express.static(path.join(__dirname, '../public')));

app.use('/v1', v1API);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.url} on this server`, 404))
})

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.use(globalErrorHandler)

module.exports = app;
