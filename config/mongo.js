const mongoose = require('mongoose');
const config = require('./config');

mongoose.connect(
    config.mongodb.uri,
    {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
        useUnifiedTopology: true
    }
);

const db = mongoose.connection;

db.on('error', (err) => {
    console.log(`MongoDB error: ${err}`);
});

db.once('open', () => {
    console.log('MongoDB connected');
});

module.exports = db;