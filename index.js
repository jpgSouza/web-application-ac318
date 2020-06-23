const express = require('express');
const bodyparser = require('body-parser');
const firebase = require('firebase');
const Auth = require('./firebase.js');
const ejs = require('ejs');
const { query } = require('express');

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
                res.render('dashboard', { events: eventsDate })
            })
    } else {
        res.redirect('/')
    }
})

app.get('/perfil', function (req, res) {
    if (userLogged) {
        let userRef = db.collection('users');
        var currentUser = firebase.auth().currentUser;
        uid = currentUser.uid
        let user = userRef.get()
            .then(snapshot => {
                const userData = []
                snapshot.forEach(doc => {
                    if (doc.id == uid) {
                        userData.push({ id: doc.id, dados: doc.data() })
                    }
                });
                let myEvents = db.collection("users").doc(uid).collection("myEvents").get().then(snapshot => {
                    const myEventData = []
                    snapshot.forEach((doc) => {
                        myEventData.push({ id: doc.id })
                    })
                    let events = db.collection("events").get().then((events) => {
                        cont = 0
                        const eventsData = []
                        events.forEach((docs) =>{
                            
                            if(cont == myEventData.length){
                                return
                            }
                            if(myEventData[cont].id == docs.id){
                                eventsData.push({ id: docs.id, dados: docs.data() })
                                cont++
                            }
                        })
                        res.render('perfil', { user: userData, myEvents: eventsData })
                    })
                })


            })
    } else {
        res.redirect('/')
    }
})

app.get('/depoimentos', function (req, res) {
    if (userLogged) {
        res.render('depoimentos')
    } else {
        res.redirect('/')
    }
})

app.get('/contact', function (req, res) {
    if (userLogged) {
        res.render('contact')
    } else {
        res.redirect('/')
    }
})

app.get('/createuser', function (req, res) {
    res.render('createuser');
})

app.post('/updateuser', function (req, res) {
    var currentUser = firebase.auth().currentUser;
    uid = currentUser.uid
    let userRef = db.collection('users').doc(uid);
    let updateUser = userRef.update({ name: req.body.name, lastname: req.body.lastname, cpf: req.body.cpf, date: req.body.date })
    res.redirect('/perfil')
})

app.post('/createevent', function (req, res) {
    let eventRef = db.collection('events')
    price = req.body.price
    price = parseFloat(price)
    let createEvent = eventRef.add({
        name: req.body.name,
        date: req.body.date, place: req.body.place, price: price, description: req.body.description
    }).then((event) => {
        var currentUser = firebase.auth().currentUser;
        uid = currentUser.uid
        myEventRef = db.collection("users").doc(uid).collection("myEvents").doc(event.id)
        myEventRef.set({
            eid: event.id
        })
    })
    res.redirect('/dashboard')
})

app.post('/deleteevent', function (req, res) {
    console.log(req.body.id)
    var currentUser = firebase.auth().currentUser;
    uid = currentUser.uid
    let myEventsRef = db.collection('users').doc(uid).collection("myEvents").doc(req.body.id);
    let allEvents = db.collection('events').doc(req.body.id)
    allEvents.delete()
    myEventsRef.delete()
    res.redirect('/perfil')
})

app.post('/createproperty', function (req, res) {
    let propertyRef = db.collection('property')
    rent = req.body.rent
    rent = parseFloat(rent)
    let createProperty = propertyRef.add({
        identification: req.body.identification,
        checkin: req.body.checkin, checkout: req.body.checkout, place: req.body.place, rent: rent, description: req.body.description, capacity: req.body.capacity
    }).then((property) => {
        var currentUser = firebase.auth().currentUser;
        uid = currentUser.uid
        myPropertyRef = db.collection("users").doc(uid).collection("myProperties").doc(property.id)
        myPropertyRef.set({
            pid: property.id
        })
    })
    res.redirect('/dashboard')
})


app.listen(3000)