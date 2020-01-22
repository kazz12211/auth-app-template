const Sequelize = require('sequelize');
const config = require('./config');

module.exports = new Sequelize(
    config.postgres.database,
    config.postgres.user,
    config.postgres.password,
    {
        host: config.postgres.host,
        port: config.postgres.port,
        dialect: 'postgres',
        operatorAliases: false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);