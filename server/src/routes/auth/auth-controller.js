const { createUser, loginUser } = require("../../models/user/user-model");
const { createSendToken } = require("../../services/auth_service")
const AppError = require("../../utils/app-error")
const catchAsync = require("../../utils/catch-async");

async function signUp(req, res, next) {
    try {
        const newUser = await createUser({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm
        })
    
        createSendToken(newUser, 201, res);
    } catch(err) {
        next(err)
    }
}

async function login(req, res, next) {
    const { email, password } = req.body;
    
    // 1) Check if email and password exist
    if (!email || !password) {
        return next(new AppError('Please provide email and password!', 400));
    }

    try {
        // 2) Check if user exists && password is correct
        const user = await loginUser({ email, password });

        // 3) If everything is okay, send token to client
        createSendToken(user, 200, res);
    } catch(err) {
        next(err)
    }
}

module.exports = {
    signUp: catchAsync(signUp),
    login: catchAsync(login)
}
