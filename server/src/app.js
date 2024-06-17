const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const { rateLimit } = require('express-rate-limit');
const { morganMiddleware } = require('./services/logger');
const v1API = require('./routes/v1');

const app = express();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    headers: true
});

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

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

module.exports = app;
