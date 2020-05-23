const mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database :'mydb',
});

connection.connect(function(err){
  if(err) return console.log(err);
  console.log('Connected!');
})

module.exports = connection;
