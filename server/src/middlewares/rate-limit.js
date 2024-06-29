const { rateLimit } = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    headers: true
});

const forgotPasswordLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    headers: true
});

const resetPasswordLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000,
    max: 1,
    headers: true
});

module.exports = {
    limiter,
    forgotPasswordLimiter,
    resetPasswordLimiter
}