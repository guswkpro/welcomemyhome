var client = require('../dao.js');


/********************
        GET
********************/
exports.getpreinspectionblueprint = function (user_idx, callback) {
        client.query('SELECT * FROM stweb.stweb_preinspections where user_idx = ?', [user_idx], function (error, result) {
                callback(error, result);
        });
};

exports.getpreinspectionpin = function (preinspection_idx, callback) {
        client.query('SELECT * FROM stweb.stweb_preinspection_pins where preinspection_idx = ?', [preinspection_idx], function (error, result) {
                console.log(result, "dao");
                callback(error, result);
        });
}

/********************
        POST
********************/

exports.addpreinspectionblueprint = function (preinspection, callback) {
        client.query('INSERT INTO stweb.stweb_preinspections (preinspection_date, preinspection_picture_path, preinspection_width, preinspection_height, user_idx) VALUES (?, ?, ?, ?, ?)',  [preinspection.preinspection_date, preinspection.preinspection_picture_path, Number(preinspection.preinspection_width), Number(preinspection.preinspection_height), preinspection.user_idx], function(error) {
                callback(error);
        });
}

exports.addpreinspectionmodal = function (pin, callback) {
        client.query('INSERT INTO stweb.stweb_preinspection_pins (preinspection_idx, pin_picture_path, pin_type, pin_content, pin_X, pin_Y) VALUES (?, ?, ?, ?, ?, ?)',  [pin.preinspection_idx, pin.pin_picture_path, pin.pin_type,  pin.pin_content, Number(pin.pin_X), Number(pin.pin_Y)], function(error) {
                callback(error);
        });
}