var mysql = require('mysql');

var client = mysql.createConnection({
    host: 'stweb.ccmxaq6oosug.ap-northeast-2.rds.amazonaws.com'
    , port: 3306
    , user: 'stweb'
    , password: 'stwebstweb'
    , database: 'stweb'
});

client.connect(function (error) {
    if (error) {
        throw error;
    }
});

module.exports = client;