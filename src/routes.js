const express = require('express');
const connection = require('./connection');

const routes = express.Router();

routes.get('/', (req, res)=>{
    connection.query("SELECT * from Pessoa", (err, rows, fields)=>{
        if(!err){
            res.send(rows);
        }
        else{
            console.log(err);
        }
    })
})

module.exports = routes; 