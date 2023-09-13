/**
 * Module dependencies.
 */
const fs = require("fs")
const path = require("path")
const express = require("express")
const passport = require('passport')
const expressSession = require('express-session')
const GoogleStrategy = require('passport-google-oauth20').Strategy;

require('dotenv').config()

/**
 * Create app.
 */
const app = express()

/**
 * Configure app port.
 */
app.set("port", process.env.API_PORT)

/**
 * Configure app request.
 */
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

/**
 * Configure app session.
 */
app.use(expressSession({
    resave: false,
    secret: 'keyboard cat',
    saveUninitialized: false
}));

/**
 * Configure passport instance.
 */
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new GoogleStrategy({
        passReqToCallback: true,
        clientID: process.env.CLIENT_ID,
        callbackURL: process.env.CALLBACK_URL,
        clientSecret: process.env.CLIENT_SECRET
    },
    function(request, accessToken, refreshToken, profile, done) {
        return done(null, profile);
    }
));

app.use(passport.initialize());
app.use(passport.session());

/**
 * Include all routes in path /routes
 */
fs.readdir(path.join(__dirname, "routes"), (err, routes) => {
    routes.map(file => {
        app.use("/", require(path.join(__dirname, "routes", file)))
    });
})

/** Console log */
console.info(`[${(new Date()).toLocaleString('pt-BR')}] API server running on 0.0.0.0:${process.env.API_PORT}`)
app.listen(process.env.API_PORT)