const { createUser, loginUser, generateResetToken, findUser, resetUserPassword } = require("../../models/user/user-model");
const { createSendToken } = require("../../services/auth_service")
const AppError = require("../../utils/app-error")
const catchAsync = require("../../utils/catch-async");
const { logger } = require("../../utils/logger");
const { sendEmail } = require("../../utils/send-email");

async function signUp(req, res) {
    const newUser = await createUser({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    })

    createSendToken(newUser, 201, res);
    logger.info(`User with email ${req.body.email} created`)
}

async function login(req, res, next) {
    const { email, password } = req.body;
    
    // 1) Check if email and password exist
    if (!email || !password) {
        return next(new AppError('Please provide email and password!', 400));
    }

    // 2) Check if user exists && password is correct
    const user = await loginUser({ email, password });

    // 3) If everything is okay, send token to client
    createSendToken(user, 200, res);
    logger.info(`User with email ${req.body.email} logged in`)
}

async function forgotPassword(req, res, next) {
    const { email } = req.body;

    const user = await findUser({email})

    const resetToken = await generateResetToken({email})

    const resetURL = `http://${req.headers.host}/v1/auth/reset-password/${resetToken}`;
    const message = `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
                    Please click on the following link, or paste this into your browser to complete the process:\n\n
                    ${resetURL}\n\n The reset token expires in 10 minutes. If you did not request this, please ignore this email and your password will remain unchanged.\n`
    
    try {
        await sendEmail({
            options: {
                email: user.email,
                subject: 'Your Password Reset Token',
                message,
            }
        })
        logger.info(`User with email ${req.body.email} requested a new password`)
        return res.status(200).json({status: 'success', message:'Token sent to email'})
    } catch(err) {
        user.passwordResetToken = undefined
        user.passwordResetExpires = undefined
        await user.save({ validateBeforeSave: false })
        
        next(new AppError('There was an error sending the password reset email. Try again later'), 500)
    }
}

async function resetPassword(req, res, next) {
    const { token } = req.params;
    const { password, passwordConfirm } = req.body;
    
    try {
        const jwtToken = await resetUserPassword({token, password, passwordConfirm})
        logger.info(`User with email ${req.body.email} changed password`)
        return res.status(200).json({ status: 'success', jwtToken })
    } catch(err) {
        next(err)
    }
}

module.exports = {
    signUp: catchAsync(signUp),
    login: catchAsync(login),
    forgotPassword: catchAsync(forgotPassword),
    resetPassword: catchAsync(resetPassword)
}
