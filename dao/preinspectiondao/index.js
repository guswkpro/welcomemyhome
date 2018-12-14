var client = require('../dao.js');


/********************
        GET
********************/

exports.getpreinspectionblueprint = function (user_idx, callback) {
        console.log(user_idx);
        client.query('SELECT * FROM stweb.stweb_preinspections where user_idx = ?', [user_idx], function (error, result) {
                console.log(result);
                callback(error, result);
        });
};


/********************
        POST
********************/