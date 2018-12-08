var client = require('../dao.js');


/********************
        GET
********************/

exports.getpreinspectionblueprint = function (user_idx, callback) {
        client.query('SELECT * FROM stweb.stweb_preinspections where user_idx = ?', [user_idx], function (error, result) {
                callback(error, result);
        });
};


/********************
        POST
********************/