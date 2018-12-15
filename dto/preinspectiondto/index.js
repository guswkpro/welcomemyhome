exports.preinspection = function(user_idx, date, imagepath, width, height, callback){
    var preinspection = {};
    preinspection.user_idx = user_idx;
    preinspection.preinspection_date = date;
    preinspection.preinspection_picture_path = imagepath;
    preinspection.preinspection_width = width;
    preinspection.preinspection_height = height;
    callback(null, preinspection);
};

exports.preinspectionpin = function(preinspection_idx, newPath, type, content, X, Y, Callback){
    var preinspectionpin = {};
    preinspectionpin.preinspection_idx = preinspection_idx;
    preinspectionpin.pin_picture_path = newPath;
    preinspectionpin.pin_type = type;
    preinspectionpin.pin_content = content;
    preinspectionpin.pin_X = X;
    preinspectionpin.pin_Y = Y;
    callback(null, preinspectionpin);
};