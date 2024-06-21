const { createUser } = require("../../models/user/user-model");
const catchAsync = require("../../utils/catch-async");

async function signUp(req, res) {
    // const newUser = createUser({
    //     name: req.body.name,
    //     email: req.body.email,
    //     password: req.body.password,
    //     passwordConfirm: req.body.passwordConfirm
    // })

    // sanitize and validate

    res.status(201).json({
        status: 'success',
        data: {
            user: newUser
        }
    })
}

module.exports = {
    signUp: catchAsync(signUp)
}
