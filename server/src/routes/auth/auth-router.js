const express = require('express')
const { signUp, login, forgotPassword, resetPassword } = require('./auth-controller')
const { forgotPasswordLimiter, resetPasswordLimiter } = require('../../middlewares/rate-limit')

const authRouter = express.Router()

authRouter.post('/signup', signUp)
authRouter.post('/login', login)

authRouter.post('/forgot-password', forgotPasswordLimiter, forgotPassword)
authRouter.patch('/reset-password/:token', resetPasswordLimiter, resetPassword)

module.exports = authRouter