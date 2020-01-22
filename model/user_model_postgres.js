const Sequelize = require('sequelize');
const db = require('../config/postgres');

const User = db.define('users', {
    username: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    },
    githubId: {
        type: Sequelize.STRING
    },
    googleId: {
        type: Sequelize.STRING
    }
});

module.exports = User;