module.exports = {
    db: process.env.DB || 'mongo',
    mongodb: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/auth'
    },
    postgres: {
        host: process.env.POSTGRES_HOST || 'localhost',
        port: process.env.POSTGRES_PORT || 5432,
        user: process.env.POSTGRES_USER || 'postgres',
        password: process.env.POSTGRES_PASSWORD || 'postgres',
        database: process.env.POSTGRES_DATABASE || 'auth'
    }
};