# auth-app-template

- Node.js + Express web server
- Swig template engine
- User entity is stored on MongoDB (using mongoose) and PostgreSQL (using Sequelize)
- Can switch db by config.db property
- Password will be crypted by bcrypt when you register user
- Guard resource pages by Json Web Token stored on session
- OAuth authentication with GitHub and Google+ (as of 2020/01/22) 


To setup this app, add keys.js into config folder.

```
module.exports = {
    jwt: {
        secretKey: 'your_secret_key'
    },
    github: {
        clientID: 'your_client_id',
        clientSecret: 'your_client_secret'
    },
    google: {
        clientID: 'your_client_id',
        clientSecret: 'your_client_secret'
    }
};
```

Then `npm install` and run the app by `node server.js`.