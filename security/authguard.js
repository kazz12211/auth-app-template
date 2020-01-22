const jwt = require('jsonwebtoken');
const config = require('../config/config');
const keys = require('../config/keys');

function authguard(req, res, next) {
    if(!req.session.token) {
        return res.status(401).send('Unauthorized request');
    }
    try {
        const payload = jwt.verify(req.session.token, keys.jwt.secretKey);
        if(!payload) {
            return res.status(401).send('Unauthorized request');
        }
        req.userId = payload.subject;
        next();
    } catch(err) {
        return res.status(401).send('Unauthorized request');
    }
}

function getUserId(req, res, next) {
    if (req.session.token) {
        try {
            const payload = jwt.verify(req.session.token, keys.jwt.secretKey);
            if (payload) {
                req.userId = payload.subject;
            }
        } catch (err) { }
    }
    next();
}


module.exports = {authguard, getUserId};