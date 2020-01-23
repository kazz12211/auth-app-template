const passport = require('passport');
const GitHubStrategy = require('passport-github');
const GoogleStrategy = require('passport-google-oauth20');
const TwitterStrategy = require('passport-twitter');
const keys = require('../config/keys');
const DB = require('../config/config').db;
const UserController = DB === 'mongo' ? require('../controller/user-controller-mongo') : require('../controller/user-controller-postgres');

function getUserId(user) {
    if(DB === 'mongo') {
        return user._id;
    } else {
        return user.id;
    }
}
passport.serializeUser( (user, done) => {
    done(null, getUserId(user));
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
                    UserController.updateGoogleUser(getUserId(user), googleId).then(result => {
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
                    UserController.updateGithubUser(getUserId(user), githubId).then(result => {
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

passport.use(new TwitterStrategy(
    {
        consumerKey: keys.twitter.clientID,
        consumerSecret: keys.twitter.clientSecret,
        callbackURL: '/auth/twitter/redirect'
    },
    (token, tokenSecret, profile, callback) => {
        const twitterId = profile.id;
        const username = profile.username;
        
        UserController.getUser(username).then(result => {
            let user = result;
            if(result && result.dataValues) {
                user = result.dataValues;
            }
            if(user) {
                if(user.twitterId) {
                    return callback(null, user);
                } else {
                    UserController.updateTwitterUser(getUserId(user), twitterId).then(result => {
                        return callback(null, result.dataValues ? result.dataValues : result);
                    });
                }
            } else {
                UserController.addTwitterUser(username, twitterId).then(result => {
                    return callback(null, result.dataValues ? result.dataValues : result);
                });
            }
        });
    }
));