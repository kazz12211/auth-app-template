const express = require('express');
const router = express.Router();
const Auth = require('../api/auth-api');
const passport = require('passport');

require('../config/passport-setup');

router.get('/signin', (req, res) => {
    res.render('signin.html', {});
});

router.post('/signin', (req, res) => {
    const {email, password} = req.body;
    Auth.signIn(email, password).then(result => {
        req.session.token = result.token;
        req.session.save( (err) => {
            setTimeout(() => res.redirect('/'), 500);
        });
    }).catch(err => {
        console.log(err);
        res.render('signin.html', {error: err});
    });
});

router.get('/signout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

router.get('/register', (req, res) => {
    res.render('register.html', {});
});

router.post('/register', (req, res) => {
    const {username, email, password} = req.body;
    Auth.register(username, email, password).then(result => {
        res.redirect('/auth/signin');
    }).catch(err => {
        console.log(err);
        res.render('register.html', {error: err});
    });
});

router.get('/github', passport.authenticate('github'));

router.get('/github/redirect', passport.authenticate('github', {
    failureRedirect: '/auth/login'
}), (req, res) => {
    Auth.gotProfile(req.user).then(result => {
        req.session.token = result.token;
        req.session.save( (err) => {
            setTimeout(() => res.redirect('/'), 500);
        });
    }).catch(err => {
        console.log(err);
        res.redirect('/auth/login');
    });
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/redirect', passport.authenticate('google', {
    failureRedirect: '/auth/signin'
}), (req, res) => {
    Auth.gotProfile(req.user).then(result => {
        req.session.token = result.token;
        req.session.save( (err) => {
            setTimeout(() => res.redirect('/'), 500);
        });
    }).catch(err => {
        console.log(err);
        res.redirect('/auth/signin');
    });
});

router.get('/twitter', (req, res) => {
    res.redirect('/auth/signin');
});

router.get('/facebook', (req, res) => {
    res.redirect('/auth/signin');
});

module.exports = router;