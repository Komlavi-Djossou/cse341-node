//login
require('dotenv').config();
const GitHubStrategy = require('passport-github').Strategy;
const passport = require('passport');
const session = require('express-session');
//login

const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./db/connect');
const cors = require('cors');

const swaggerAutogen = require('swagger-autogen')();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const port = process.env.PORT || 3000;
const app = express();

app
.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
.use(cors())
.use(express.json())
.use(bodyParser.json())
.use(express.urlencoded({ extended: true}))
.use('/', require('./routes'));

//login codes
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function (user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
  cb(null, id);
});

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      callbackURL: 'http://localhost:3000/auth/github/callback',
    },
    function (accessToken, refreshToken, profile, cb) {
      cb(null, profile);
    }
  )
);

const isAuth = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect('/login');
  }
};

app.get('/', isAuth, (req, res) => {
  res.sendFile(__dirname + '/dashboard.html');
});

app.get('/login', (req, res) => {
  if (req.user) {
    return res.redirect('/');
  }
  res.sendFile(__dirname + '/login.html');
});

app.get('/logout', (req, res) => {
  req.logOut();
  res.redirect('/login');
});

//auth
app.get('/auth/github', passport.authenticate('github'));

app.get(
  '/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  }
);

//login codes


// const db = requre('./models');
//   db.mongoose
//   .connect(db.url, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   })
//   .then

mongodb.initDb((err, mongodb) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port);
    console.log(`Connected to DB and listening on ${port}`);
  }
});

