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

exports.addpreinspectionblueprint = function (preinspection, callback) {
        client.query('INSERT INTO stweb.stweb_preinspections (preinspection_date, preinspection_picture_path, preinspection_width, preinspection_height, user_idx) VALUES (?, ?, ?, ?, ?)',  [preinspection.preinspection_date, preinspection.preinspection_picture_path, Number(preinspection.preinspection_width), Number(preinspection.preinspection_height), preinspection.user_idx], function(error) {
                callback(error);
        });
}