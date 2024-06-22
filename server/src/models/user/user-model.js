const User = require("./user-schema");

async function createUser({name, email, password, passwordConfirm}) {
    try {
        return await User.create({name, email, password, passwordConfirm})
    } catch(err) {
        throw err
    }
}

module.exports = {
    createUser
}