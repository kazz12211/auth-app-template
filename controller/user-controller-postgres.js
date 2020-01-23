const User = require('../model/user_model_postgres');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

const UserController = {

    getUser: (emailOrUsername) => {
        return User.findOne({
            where: {
                [Op.or]: [
                    { email: emailOrUsername },
                    { username: emailOrUsername }
                ]
            }
        });
    },

    findById: (id) => {
        return User.findByPk(id);
    },

    addUser: (username, email, password) => {
        const salt = bcrypt.genSaltSync(10);

        return User.create({
            username: username,
            email: email,
            password: bcrypt.hashSync(password, salt)
        });
    },

    addGithubUser: (username, email, githubId) => {
        return User.create({
            username: username,
            email: email,
            githubId: githubId
        });
    },

    updateGithubUser: (id, githubId) => {
        return new Promise((resolve, reject) => {
            User.findByPk(parseInt(id)).then(user => {
                user.githubId = githubId;
                user.save({ fields: ['githubId'] }).then(saved => {
                    resolve(saved);
                }).catch(err => {
                    reject(err);
                });
            });
        });
    },

    addGoogleUser: (username, email, googleId) => {
        return User.create({
            username: username,
            email: email,
            googleId: googleId
        });
    },

    updateGoogleUser: (id, googleId) => {
        return new Promise((resolve, reject) => {
            User.findByPk(parseInt(id)).then(user => {
                user.googleId = googleId;
                user.save({ fields: ['googleId'] }).then(saved => {
                    resolve(saved);
                }).catch(err => {
                    reject(err);
                });
            });
        });
    },

    addTwitterUser: (username, twitterId) => {
        return User.create({
            username: username,
            twitterId: twitterId
        });
    },

    updateTwitterUser: (id, twitterId) => {
        return new Promise((resolve, reject) => {
            User.findByPk(parseInt(id)).then(user => {
                user.twitterId = twitterId;
                user.save({ fields: ['twitterId'] }).then(saved => {
                    resolve(saved);
                }).catch(err => {
                    reject(err);
                });
            });
        });
    },

    getUsers: () => {
        return new Promise((resolve, reject) => {
            User.findAll().then(result => {
                const users = result.map(res => res.dataValues);
                resolve(users);
            }).catch(err => {
                reject(err);
            });
        });
    },

    updateLastLogin: (user) => {
        return new Promise( (resolve, reject) => {
            User.findByPk(user.id).then(user => {
                user.lastLogin = new Date();
                user.save({ fields: ['lastLogin']}).then(saved => {
                    resolve();
                }).catch(err => {
                    reject(err);
                });
            }).catch(err => {
                reject(err);
            });
        });
    }
}

module.exports = UserController;