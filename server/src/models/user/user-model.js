const bcrypt = require('bcrypt')

const User = require("./user-schema");
const AppError = require("../../utils/app-error")

async function createUser({name, email, password, passwordConfirm}) {
    try {
        return await User.create({name, email, password, passwordConfirm})
    } catch(err) {
        if (err.code === 11000) throw new AppError('Email already exists', 409)
        throw err
    }
}

async function loginUser({ email, password }) {
    try {
        const user = await User.findOne({ email }).select('+password'); 

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new AppError('Incorrect email or password', 401);
        }

        return user;
    } catch (err) {
        throw err;
    }
}

module.exports = {
    createUser,
    loginUser,
}