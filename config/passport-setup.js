const passport = require('passport');
const GitHubStrategy = require('passport-github');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('../config/keys');
const UserController = require('../controller/user-controller');
const DB = require('../config/config').db;

passport.serializeUser( (user, done) => {
    if(DB === 'mongo') {
        done(null, user._id);
    } else {
        done(null, user.id);
    }
});

passport.deserializeUser( (id, done) => {
    UserController.findById(id).then(user => {
        done(null, user);
    }).catch(err => {
        done(err, null);
    });
});

passport.use(
    new GoogleStrategy({
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret,
        callbackURL: '/auth/google/redirect'
    }, (accessToken, refreshToken, profile, callback) => {
        const email = profile._json.email;
        const googleId = profile.id;
        const username = profile.displayName;
        UserController.getUser(email).then(result => {
            let user = result;
            if(result && result.dataValues) {
                user = result.dataValues;
            }
            if(user) {
                if(user.googleId) {
                    return callback(null, user);
                } else {
                    UserController.updateGoogleUser(user._id ? user._id : user.id, googleId).then(result => {
                        return callback(null, result.dataValues ? result.dataValues : result);
                    });
                }
            } else {
                UserController.addGoogleUser(username, email, googleId).then(result => {
                    return callback(null, result.dataValues ? result.dataValues : result);
                });
            }
        });
    })
);

passport.use(
    new GitHubStrategy({
        clientID: keys.github.clientID,
        clientSecret: keys.github.clientSecret,
        callbackURL: '/auth/github/redirect'
    }, (accessToken, refreshToken, profile, callback) => {
        const email = profile._json.email;
        const githubId = profile.id;
        const username = profile.displayName;
        
        UserController.getUser(email).then(result => {
            let user = result;
            if(result && result.dataValues) {
                user = result.dataValues;
            }
            if(user) {
                if(user.githubId) {
                    return callback(null, user);
                } else {
                    UserController.updateGithubUser(user._id ? user._id : user.id, githubId).then(result => {
                        return callback(null, result.dataValues ? result.dataValues : result);
                    });
                }
            } else {
                UserController.addGithubUser(username, email, githubId).then(result => {
                    return callback(null, result.dataValues ? result.dataValues : result);
                });
            }
        });
    })
);