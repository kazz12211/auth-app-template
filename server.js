const express = require('express');
const session = require('express-session');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const swig = require('swig');
const passport = require('passport');

const PORT = process.env.PORT || 3000;
const DB = require('./config/config').db;

if (DB === 'mongo') {
    const db = require('./config/mongo');
} else {
    const db = require('./config/postgres');
    db.authenticate()
        .then( () => {
            console.log('PostgreSQL connected');
        })
        .catch( err => {
            console.log(`PostgreSQL error: ${err}`);
        });
}

app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({extended: true, limit: '20mb'}));

app.use(express.static(path.join(__dirname, 'public')));

// error handler function
app.use( (err, req, res, next) => {
    res.render('error.html', {error: err, token: req.session.token});
});

app.use('/', require('./routes/web'));
app.use('/auth', require('./routes/auth'));

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});