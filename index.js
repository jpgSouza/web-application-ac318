const express = require('express');
const bodyparser = require('body-parser');
const ejs = require('ejs');


const app = express()

var publicDir = require('path').join(__dirname,'/public');
app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static(publicDir));
app.use('/', express.static(__dirname + '/www')); // redirect root
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
app.use('/style', express.static(__dirname + '/style/')); // redirect CSS bootstrap
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render("index.ejs")
})

app.listen(3000)