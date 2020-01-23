const DB = require('../config/config').db;
const UserController = DB === 'mongo' ? require('../controller/user-controller-mongo') : require('../controller/user-controller-postgres');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

const Auth = { 
    signIn: (emailOrUsername, password) => {
        return new Promise( (resolve, reject) => {
            UserController.getUser(emailOrUsername).then(result => {
                let user = result;
                if(result && result.dataValues) {
                    user = result.dataValues;
                }
                const userId = user._id || user.id;
                const match = bcrypt.compareSync(password, user.password);
                if(match) {
                    const payload = {
                        subject: userId
                    };
                    const token = jwt.sign(payload, keys.jwt.secretKey);
                    UserController.updateLastLogin(user).then( () => {
                        resolve({token});
                    }).catch(err => {
                        reject(err);
                    });
                } else {
                    reject(new Error('Invalid username or password'));
                }
            }).catch(err => {
                reject(err);
            });
        });
    },
    register: (username, email, password) => {
        return new Promise( (resolve, reject) => {
            UserController.getUser(email).then(result => {
                let user = result;
                if(result && result.dataValues) {
                    user = result.dataValues;
                }
                if(user) {
                    reject(new Error('The user is already registered'));
                } else {
                    UserController.addUser(username, email, password).then(result => {
                        resolve();
                    }).catch(err => {
                        reject(err);
                    });    
                }
            }).catch(err => {
                reject(err);
            });
        });
    },
    getUser: (userId) => {
        return new Promise( (resolve, reject) => {
            UserController.getUserById(userId).then(result => {
                let user = result;
                if(result && result.dataValues) {
                    user = result.dataValues;
                }
                if(user) {
                    delete user.password;
                    resolve(user);        
                } else {
                    reject(new Error('User not found'));
                }
            }).catch(err => {
                reject(err);
            });
        });

    },
    gotProfile: (user) => {
        return new Promise( (resolve, reject) => {
            const userId = user._id || user.id;
            const payload = {
                subject: userId
            };
            const token = jwt.sign(payload, keys.jwt.secretKey);
            UserController.updateLastLogin(user).then( () => {
                resolve({token});
            }).catch(err => {
                reject(err);
            });
        });
    }
};

module.exports = Auth;