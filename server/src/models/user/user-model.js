const User = require("./user-schema");

async function createUser({name, email, password, passwordConfirm}) {
    await User.create({name, email, password, passwordConfirm})
}

module.exports = {
    createUser
}