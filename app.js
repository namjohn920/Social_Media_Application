//Load Modules
const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');

//Connect to MongoURI exported from external file
const keys = require('./config/keys');

//Initialize application
var app = express();

//Set up Template Engine
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//Set up Static file to serve css, js, and images
app.use(express.static('public'));

//connect to remote database
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

app.listen(port, () => {
    console.log("SERVER STARTED AT PORT " + port);
});