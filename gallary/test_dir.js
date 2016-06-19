/**
 * Created by lenovo on 16-6-19.
 */
var recursive = require('recursive-readdir');

recursive('./img', function (err, files) {
    // Files is an array of filename
    console.log(files);
});