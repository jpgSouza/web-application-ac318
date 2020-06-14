const express = require('express');
const bodyparser = require('body-parser');
const firebase = require('firebase');
const Auth = require('./firebase.js');
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

firebase.auth().onAuthStateChanged((user) => {
    if(user){
        userLogged = user
    }else{
        userLogged = null
    }
})

app.get('/', (req, res) => {
    res.render("index")
})

app.post('/createuser', (req, res) => {
    Auth.SignUpWithEmailAndPassword(req.body.email,req.body.password).then((user) => {
       if(!user.err){
          let userData = JSON.parse(user)
          userData = userData.user
          Auth.insertUserData(userData).then(() => {
            res.redirect('/dashboard')
          })
       }else{
          return user.err
       }
   })
  })

app.post('/login', (req, res) => {
    let getBody = req.body;
    Auth.SignUpWithEmailAndPassword(getBody.email, getBody.password).then((login) => {
        if(!login.err){
            res.redirect('/dashboard')
        }else{
            res.redirect('/')
        }
    })
})

app.get('/dashboard', function (req, res){
    if(userLogged){
        res.render('dashboard');
    }else{
        res.redirect('/')
    }
})

app.listen(3000)