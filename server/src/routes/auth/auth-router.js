const express = require('express')
const { signUp, login, forgotPassword, resetPassword } = require('./auth-controller')

const authRouter = express.Router()

authRouter.post('/signup', signUp)
authRouter.post('/login', login)

authRouter.post('/forgot-password',forgotPassword)
authRouter.patch('/reset-password/:token', resetPassword)

module.exports = authRouter