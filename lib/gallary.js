/**
 * Created by Administrator on 2016/6/20.
 */
var recursive = nodeRequire('recursive-readdir');

function addAnother (src,alt,desc) {
    var li = document.createElement("li");

    var img = document.createElement("img");
    img.setAttribute("src", src||''); // added line
    alt = alt||'';
    img.setAttribute("alt", alt||''); // added line
    desc = desc||'';
    img.setAttribute("data-description", desc); // added line
    li.appendChild(img);

    document.getElementsByClassName('pgwSlideshow')[0].appendChild(li);
}

var IsPicture = function(fileName)
{
    //alert(fileName);
    //判断是否是图片 - strFilter必须是小写列举
    var strFilter=".jpeg|.gif|.jpg|.png|.bmp|.pic|"
    if(fileName.indexOf(".")>-1)
    {
        var p = fileName.lastIndexOf(".");

        var strPostfix=fileName.substring(p,fileName.length) + '|';
        strPostfix = strPostfix.toLowerCase();
        //alert(strPostfix);
        if(strFilter.indexOf(strPostfix)>-1)
        {
            //alert("True");
            return true;
        }
    }
    //alert('False');
    return false;
};
var pgwSlideshow = null;

var showDirPics = function(imgDir)
{
    if(pgwSlideshow) {
        pgwSlideshow.destroy();
        var div = document.getElementsByClassName('htmleaf-content')[0];
        var ul = document.createElement("ul");
        ul.setAttribute("class", 'pgwSlideshow'); // added line
        div.appendChild(ul);
    }
    console.log(imgDir);
    //读取图片的说明文字content.js

    //遍历图片文件夹
    recursive(imgDir, function (err, files) {
        // Files is an array of filename
        if(err)
            console.error(err);

        //循环调用addAnother，加入到div中
        for (var f in files) {
            console.log(files[f]);
            if(IsPicture(files[f]))
                addAnother('file://'+files[f]);
        }

        pgwSlideshow = $('.pgwSlideshow').pgwSlideshow({
            transitionEffect:'fading',
            autoSlide:false
        });


    });
};


var nextPic = function()
{
    pgwSlideshow.nextSlide();
};

var prevPic = function()
{
    pgwSlideshow.previousSlide();
};

var zoomPic = function()
{
    console.log('放大图片');
	var li = document.querySelector('li[style*="block"]');
	var image = li.firstChild;
    //alert(image.src);
	image.style.webkitTransform ='scale(1.5,1.5)';
};

module.exports={
    showDirPics,
    nextPic,
    prevPic,
    zoomPic
};