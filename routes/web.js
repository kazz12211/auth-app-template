const express = require('express');
const router = express.Router();
const authguard = require('../security/authguard').authguard;
const getUserId = require('../security/authguard').getUserId;

router.get('/', (req, res) => {
    res.render('index.html', { token: req.session.token });
});


router.get('/public', getUserId, (req, res) => {
    res.render('public.html', { token: req.session.token });
});

router.get('/protected', authguard, (req, res) => {
    res.render('protected.html', { token: req.session.token });
});


module.exports = router;