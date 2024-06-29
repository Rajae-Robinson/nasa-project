const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        minlength: [3, 'Name must be at least 3 characters long'],
        maxlength: [50, 'Name must be at most 50 characters long']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long'],
        validate: {
            validator: function(el) {
                return el.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/);
            },
            message: 'Password must contain at least one uppercase letter, one lowercase letter, and one digit'
        },
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Password confirmation is required'],
        validate: {
            validator: function(el) {
                return el === this.password;
            },
            message: 'Passwords do not match'
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, {
    toJSON: {
        transform: function(doc, ret) {
            delete ret._id;
            delete ret.__v;
            delete ret.password;
            delete ret.passwordResetToken,
            delete ret.passwordResetExpires,
            delete ret.passwordChangedAt
            return ret;
        }
    },
    toObject: {
        transform: function(doc, ret) {
            delete ret._id;
            delete ret.__v;
            delete ret.password;
            delete ret.passwordResetToken,
            delete ret.passwordResetExpires,
            delete ret.passwordChangedAt
            return ret;
        }
    }
});

// Middleware to hash password before saving
userSchema.pre('save', async function(next) {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) return next();

    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    // Delete passwordConfirm field
    this.passwordConfirm = undefined;
    next();
});

// Middleware to update passwordChangedAt field
userSchema.pre('save', function(next) {
    // Only run this function if password was actually modified and it is not a new user
    if (!this.isModified('password') || this.isNew) return next();
  
    // Set passwordChangedAt to the current time
    this.passwordChangedAt = Date.now() - 1000; // Subtract 1 second to ensure the token is created after this time
  
    next();
});

// Instance method to check if password was changed after token was issued
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
      const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
      return JWTTimestamp < changedTimestamp;
    }
    // False means NOT changed
    return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
