const crypto = require('crypto')

const bcrypt = require('bcrypt')

const User = require("./user-schema");
const { signToken } = require("../../services/auth_service")
const AppError = require("../../utils/app-error");

async function createUser({name, email, password, passwordConfirm}) {
    try {
        return await User.create({name, email, password, passwordConfirm})
    } catch(err) {
        if (err.code === 11000) throw new AppError('Email already exists', 409)
        if (err.name === 'ValidationError') throw new AppError(err.message, 400)
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

async function findUser({email}) {
  const user = await User.findOne({ email })
  if (!user) {
    throw new AppError('User with that email does not exist', 400)
  }
  return user
}

async function generateResetToken({email}) {
  // Find the user by email
  const user = await findUser({email})

  // Generate a reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
  
  // Set token expiration time
  const resetTokenExpires = Date.now() + 10 * 60 * 1000;

  // Save the token and its expiration time to the user
  user.passwordResetToken = hashedResetToken;
  user.passwordResetExpires = resetTokenExpires;
  
  try {
    await user.save({ validateBeforeSave: false });
  } catch(err) {
    throw err
  }

  return resetToken
}

async function resetUserPassword({token, password, passwordConfirm}) {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

  // Find the user by reset token and check if it is still valid
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new AppError('Password reset token is invalid or has expired', 400)
  }

  // Set the new password and clear the reset token fields
  user.password = password;
  user.passwordConfirm = passwordConfirm
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  const jwtToken = signToken(user._id);

  return jwtToken
}

module.exports = {
    createUser,
    loginUser,
    findUser,
    resetUserPassword,
    generateResetToken,
}