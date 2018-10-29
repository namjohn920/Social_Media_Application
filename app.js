//Load Modules
const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');

//Connect to MongoURI exported from external file
const keys = require('./config/keys');
//User collection
const User = require('./models/user');
require('./passport/google-passport');

//Initialize application
var app = express();

//Express Config
app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(session({ 
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
 }));
app.use(passport.initialize());
app.use(passport.session());

//set Global vairables for user
app.use((req, res, next) => {
     res.locals.user = req.user || null;
     next(); 
});

//Set up Template Engine
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//Set up Static file to serve css, js, and images
app.use(express.static('public'));

//connect to remote database
mongoose.Promise = global.Promise; 
mongoose.connect(keys.MongoURI, {useNewUrlParser: true})
.then(() => {
    console.log('Connected to Database');
})
.catch((err) => {
    console.log(err);
});

//set port
const port = process.env.PORT || 3000;

//Handle Routes
app.get('/', (req, res) => {
    res.render('home');
});

app.get('/about', (req, res) => {
    res.render('about');
});

//Google Auth Route
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/profile');
  });

app.get('/profile', (req, res)=> {
  User.findById({_id:req.user._id})
  .then((user) => {
    res.render('profile', {
        user: user
    });
  }); 
});
// Handle User Logout route
app.get('/logout', (req,res)=> {
    req.logout();
    res.redirect('/');    
});

app.listen(port, () => {
    console.log("SERVER STARTED AT PORT " + port);
});