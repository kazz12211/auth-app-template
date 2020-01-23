const express = require('express');
const router = express.Router();
const authguard = require('../security/authguard').authguard;
const getUserId = require('../security/authguard').getUserId;
const DB = require('../config/config').db;
const UserController = DB === 'mongo' ? require('../controller/user-controller-mongo') : require('../controller/user-controller-postgres');

router.get('/', (req, res) => {
    res.render('index.html', { token: req.session.token });
});


router.get('/public', getUserId, (req, res) => {
    UserController.findById(req.userId).then(user => {
        res.render('public.html', { token: req.session.token, user: user });
    }).catch(err => {
        res.render('public.html', { token: req.session.token, error: err });
    });
});

router.get('/protected', authguard, (req, res) => {
    UserController.getUsers().then(users => {
        res.render('protected.html', { token: req.session.token, users: users });
    }).catch(err => {
        res.render('protected.html', { token: req.session.token, error: err });
    });
});

router.get('/profile', authguard, (req, res) => {
    UserController.findById(req.userId).then(user => {
        res.render('profile.html', { token: req.session.token, user: user});
    }).catch(err => {
        res.render('profile.html', { token: req.session.token, error: err});
    });
});

module.exports = router;