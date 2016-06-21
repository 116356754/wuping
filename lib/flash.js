/**
 * Created by Administrator on 2016/6/14.
 */
var flashvars = {};
var params = {
    wmode: "transparent",
    allowScriptAccess: "always",
    scale: "exactFit",
    play:true,
    loop:false,
    allowfullscreen : true,
    swliveconnect:true
};

var attributes = { width:"100%", height:"100%" };

var _targetID =null;
//Support function: checks to see if target
//element is an object or embed element
function isObject(targetID){
    var isFound = false;
    var el = document.getElementById(targetID);
    if(el && (el.nodeName === "OBJECT" || el.nodeName === "EMBED")){
        isFound = true;
    }
    return isFound;
}

//Support function: creates an empty
//element to replace embedded SWF object
function replaceSwfWithEmptyDiv(targetID){
    var el = document.getElementById(targetID);
    if(el){
        var div = document.createElement("div");
        el.parentNode.insertBefore(div, el);

        //Remove the SWF
        swfobject.removeSWF(targetID);
        //Give the new DIV the old element's ID
        div.setAttribute("id", targetID);
    }
}

function loadSWF(url, targetID){
    _targetID = targetID;

    //Check for existing SWF
    if(isObject(_targetID)){
        //replace object/element with a new div
        replaceSwfWithEmptyDiv(_targetID);
    }

    //Embed SWF
    if (swfobject.hasFlashPlayerVersion("7")) {
        attributes.data=url;
        var obj = swfobject.createSWF(attributes, params, _targetID);
    }
}

function StopFlashMovie() {
    swfobject.getObjectById(_targetID).StopPlay();
}

function PlayFlashMovie() {
    swfobject.getObjectById(_targetID).Play();
}


function RewindFlashMovie() {
    swfobject.getObjectById(_targetID).Rewind();
}

function NextFrameFlashMovie() {
    var flashMovie =  swfobject.getObjectById(_targetID);
    var totalFrames = flashMovie.TotalFrames();
    //// 4 is the index of the property for _currentFrame
    var currentFrame = flashMovie.CurrentFrame();

    var nextFrame = parseInt(currentFrame);
    if (nextFrame >= totalFrames)
        nextFrame = 0;
    flashMovie.Rewind(3);
}


function ZoominFlashMovie() {
    var flashMovie =  swfobject.getObjectById(_targetID);
    flashMovie.Zoom(90);
}

function ZoomoutFlashMovie() {
    var flashMovie =  swfobject.getObjectById(_targetID);
    flashMovie.Zoom(110);
}

function FlashObj()
{
    return swfobject.getObjectById(_targetID);
}

var IsSwf = function(fileName)
{
    alert(fileName);
    //判断是否是图片 - strFilter必须是小写列举
    var strFilter=".swf";

    if(fileName.substring(fileName.length-strFilter.length)==strFilter)
        return true;

    return false;
};

module.exports={
    loadSWF,
    StopFlashMovie,
    FlashObj,
    IsSwf
};