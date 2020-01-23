const DB = require('../config/config').db;
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

const UserController = {

    getUser: (emailOrUsername) => {
        if (DB === 'mongo') {
            const User = require('../model/user_model_mongo');
            return User.findOne({$or: [{ email: emailOrUsername}, {username: emailOrUsername }]});
        } else {
            const User = require('../model/user_model_postgres');
            return User.findOne({
                where: {
                    [Op.or] : [
                        {email: emailOrUsername},
                        {username: emailOrUsername}
                    ]
                }
            });
        }
    },

    findById: (id) => {
        if(DB === 'mongo') {
            const User = require('../model/user_model_mongo');
            return User.findById(id).exec();
        } else {
            const User = require('../model/user_model_postgres');
            return User.findByPk(id);
        }
    },

    addUser: (username, email, password) => {
        const salt = bcrypt.genSaltSync(10);

        if (DB === 'mongo') {
            const User = require('../model/user_model_mongo');
            const user = new User({
                username: username,
                email: email,
                password: bcrypt.hashSync(password, salt)
            });
            return user.save();
        } else {
            const User = require('../model/user_model_postgres');
            return User.create({
                username: username,
                email: email,
                password: bcrypt.hashSync(password, salt)
            });
        }
    },

    addGithubUser: (username, email, githubId) => {
        if (DB === 'mongo') {
            const User = require('../model/user_model_mongo');
            const user = new User({
                username: username,
                email: email,
                githubId: githubId
            });
            return user.save();
        } else {
            const User = require('../model/user_model_postgres');
            return User.create({
                username: username,
                email: email,
                githubId: githubId
            });
        }
    },

    updateGithubUser: (id, githubId) => {
        return new Promise((resolve, reject) => {
            if (DB === 'mongo') {
                const User = require('../model/user_model_mongo');
                User.findById(id).exec().then(user => {
                    user.githubId = githubId;
                    user.save().then(saved => {
                        resolve(saved);
                    }).catch(err => {
                        reject(err);
                    })
                });
            } else {
                const User = require('../model/user_model_postgres');
                User.findByPk(parseInt(id)).then(user => {
                    user.githubId = githubId;
                    user.save({fields: ['githubId']}).then(saved => {
                        resolve(saved);
                    }).catch(err => {
                        reject(err);
                    });
                });
            }
        });
    },

    addGoogleUser: (username, email, googleId) => {
        if (DB === 'mongo') {
            const User = require('../model/user_model_mongo');
            const user = new User({
                username: username,
                email: email,
                googleId: googleId
            });
            return user.save();
        } else {
            const User = require('../model/user_model_postgres');
            return User.create({
                username: username,
                email: email,
                googleId: googleId
            });
        }
    },

    updateGoogleUser: (id, googleId) => {
        return new Promise((resolve, reject) => {
            if (DB === 'mongo') {
                const User = require('../model/user_model_mongo');
                User.findById(id).exec().then(user => {
                    user.googleId = googleId;
                    user.save().then(saved => {
                        resolve(saved);
                    }).catch(err => {
                        reject(err);
                    })
                });
            } else {
                const User = require('../model/user_model_postgres');
                User.findByPk(parseInt(id)).then(user => {
                    user.googleId = googleId;
                    user.save({fields: ['googleId']}).then(saved => {
                        resolve(saved);
                    }).catch(err => {
                        reject(err);
                    });
                });
            }
        });
    },

    addTwitterUser: (username, twitterId) => {
        if (DB === 'mongo') {
            const User = require('../model/user_model_mongo');
            const user = new User({
                username: username,
                twitterId: twitterId
            });
            return user.save();
        } else {
            const User = require('../model/user_model_postgres');
            return User.create({
                username: username,
                twitterId: twitterId
            });
        }
    },

    updateTwitterUser: (id, twitterId) => {
        return new Promise((resolve, reject) => {
            if (DB === 'mongo') {
                const User = require('../model/user_model_mongo');
                User.findById(id).exec().then(user => {
                    user.twitterId = twitterId;
                    user.save().then(saved => {
                        resolve(saved);
                    }).catch(err => {
                        reject(err);
                    })
                });
            } else {
                const User = require('../model/user_model_postgres');
                User.findByPk(parseInt(id)).then(user => {
                    user.twitterId = twitterId;
                    user.save({fields: ['twitterId']}).then(saved => {
                        resolve(saved);
                    }).catch(err => {
                        reject(err);
                    });
                });
            }
        });
    },

    getUsers: () => {
        if(DB === 'mongo') {
            const User = require('../model/user_model_mongo');
            return User.find({}).exec();
        } else {
            const User = require('../model/user_model_postgres');
            return new Promise( (resolve, reject) => {
                User.findAll().then(result => {
                    const users = result.map(res => res.dataValues);
                    resolve(users);
                }).catch(err => {
                    reject(err);
                });
            });
        }
    }
}

module.exports = UserController;