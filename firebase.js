const firebase = require('firebase');
const { firestore } = require('firebase');
const { query } = require('express');

firebase.initializeApp(firebaseConfig);

db = firebase.firestore();
var uid;
var docRef;

module.exports.SignUpWithEmailAndPassword = (email, password) => {
    return firebase.auth().createUserWithEmailAndPassword(email,password).then((doc) => {
        var user = firebase.auth().currentUser;
        uid = user.uid;
        docRef = db.collection("users").doc(uid);
        return JSON.stringify(doc)
    })
    .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode == 'auth/weak-password') {
            return {err: 'The password is too weak.'}
        } else {
          return {err: errorMessage }
        }
        return {err: error}
    });
}

module.exports.SignInWithEmailAndPassword = (email, password) => {
    return firebase.auth().signInWithEmailAndPassword(email, password)
           .catch(function(error) {
             // Handle Errors here.
             var errorCode = error.code;
             var errorMessage = error.message;
             if (errorCode === 'auth/wrong-password') {
               return {err: 'Wrong password.'}
             } else {
               return {err: errorMessage}
             }
             return {err: error}
           });
   }

module.exports.InputData = (email, name, lastname, cpf) => {
  docRef.set({
    email: email,
    name: name,
    lastname: lastname,
    cpf: cpf
  }).then(function(){
    console.log("Saved");
  }).catch(function(err){
    console.log("Erro: ", err)
  });
}


return module.exports
