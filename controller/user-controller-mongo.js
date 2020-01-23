const User = require('../model/user_model_mongo');
const bcrypt = require('bcryptjs');

const UserController = {

    getUser: (emailOrUsername) => {
        return User.findOne({ $or: [{ email: emailOrUsername }, { username: emailOrUsername }] });
    },

    findById: (id) => {
        return User.findById(id).exec();
    },

    addUser: (username, email, password) => {
        const salt = bcrypt.genSaltSync(10);

        const user = new User({
            username: username,
            email: email,
            password: bcrypt.hashSync(password, salt)
        });
        return user.save();
    },

    addGithubUser: (username, email, githubId) => {
        const user = new User({
            username: username,
            email: email,
            githubId: githubId
        });
        return user.save();
    },

    updateGithubUser: (id, githubId) => {
        return new Promise((resolve, reject) => {
            User.findById(id).exec().then(user => {
                user.githubId = githubId;
                user.save().then(saved => {
                    resolve(saved);
                }).catch(err => {
                    reject(err);
                })
            });
        });
    },

    addGoogleUser: (username, email, googleId) => {
        const user = new User({
            username: username,
            email: email,
            googleId: googleId
        });
        return user.save();
    },

    updateGoogleUser: (id, googleId) => {
        return new Promise((resolve, reject) => {
            User.findById(id).exec().then(user => {
                user.googleId = googleId;
                user.save().then(saved => {
                    resolve(saved);
                }).catch(err => {
                    reject(err);
                })
            });
        });
    },

    addTwitterUser: (username, twitterId) => {
        const user = new User({
            username: username,
            twitterId: twitterId
        });
        return user.save();
    },

    updateTwitterUser: (id, twitterId) => {
        return new Promise((resolve, reject) => {
            User.findById(id).exec().then(user => {
                user.twitterId = twitterId;
                user.save().then(saved => {
                    resolve(saved);
                }).catch(err => {
                    reject(err);
                })
            });
        });
    },

    getUsers: () => {
        return User.find({}).exec();
    }
}

module.exports = UserController;