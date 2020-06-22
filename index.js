const express = require('express');
const bodyparser = require('body-parser');
const firebase = require('firebase');
const Auth = require('./firebase.js');
const ejs = require('ejs');

let userLogged;

db = firebase.firestore()
const app = express()
var publicDir = require('path').join(__dirname, '/public');

app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static(publicDir));
app.use('/', express.static(__dirname + '/www')); // redirect root
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
app.use('/style', express.static(__dirname + '/style/')); // redirect CSS bootstrap

app.set('view engine', 'ejs');

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        userLogged = user
    } else {
        userLogged = null
    }
})

app.get('/', (req, res) => {
    res.render("index")
})

app.post('/createuser', (req, res) => {
    Auth.SignUpWithEmailAndPassword(req.body.email, req.body.password, req.body.name, req.body.lastname, req.body.cpf).then((user) => {
        if (!user.err) {
            let userData = JSON.parse(user)
            userData = userData.user
            Auth.InputData(req.body.email, req.body.name, req.body.lastname, req.body.cpf)
            res.redirect('/')
        } else {
            return user.err
        }
    })
})

app.post('/login', (req, res) => {
    let getBody = req.body;
    Auth.SignInWithEmailAndPassword(getBody.email, getBody.password).then((login) => {
        if (!login.err) {
            res.redirect('/dashboard')
        } else {
            res.redirect('/')
        }
    })
})

app.get('/dashboard', function (req, res) {
    if (userLogged) {
        var name
        let eventsRef = db.collection('events');
        let allEvents = eventsRef.get()
            .then(snapshot => {
                const eventsDate = []
                snapshot.forEach(doc => {
                    eventsDate.push({ id: doc.id, dados: doc.data() })
                });
                console.log(eventsDate)
                res.render('dashboard', {events: eventsDate})
            })
    } else {
        res.redirect('/')
    }
})

app.get('/createuser', function (req, res) {
    res.render('createuser');
})

app.listen(3000)