/**
 * Created by lenovo on 16-6-19.
 */
/**
 * ��ȡ�ļ�����������е��ļ�(�������ļ���)
 * @param {String} dir
 * @param {Function} callback
 * @returns {Array}
 */

var fs = require('fs');

exports.getAllFiles = function (dirpath, callback) {
    var filesArr = [];

    (function dir(dirpath, fn) {
        var files = fs.readdirSync(dirpath);
        exports.async(files, function (item, next) {
            var info = fs.statSync(dirpath + item);
            if (info.isDirectory()) {
                dir(dirpath + item + '/', function () {
                    next();
                });
            } else {
                filesArr.push(dirpath + item);
                callback && callback(dirpath + item);
                next();
            }
        }, function (err) {
            !err && fn && fn();
        });
    })(dirpath,callback);
    return filesArr;
};
