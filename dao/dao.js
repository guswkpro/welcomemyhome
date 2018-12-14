var mysql = require('mysql');

var client = mysql.createConnection({
    host: '127.0.0.1'
    , port: 3306
    , user: 'root'
    , password: 'dkflfkd13gh'
    , database: 'stweb'
});

client.connect(function (error) {
    if (error) {
        throw error;
    }
});

module.exports = client;