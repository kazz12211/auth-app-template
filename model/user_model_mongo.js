const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            require: true,
            trim: true
        },
        email: {
            type: String,
            require: false,
            trim: true
        },
        password: {
            type: String,
            require: true,
            trim: true
        },
        githubId: {
            type: String,
            require: false,
            trim: true
        },
        googleId: {
            type: String,
            require: false,
            trime: true
        },
        twitterId: {
            type: String,
            required: false,
            trim: true
        }
    }
);

UserSchema.plugin(timestamp);

const User = mongoose.model('User', UserSchema);

module.exports = User;