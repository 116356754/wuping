/**
 * Created by Administrator on 2016/6/14.
 */
var flashvars = {};
var params = {
    wmode: "transparent",
    allowScriptAccess: "always",
    scale: "exactFit",
    play:false,
    loop:true,
    allowfullscreen : true,
    swliveconnect:true
};

var attributes = { width:"100%", height:"100%" };


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
    //Check for existing SWF
    if(isObject(targetID)){
        //replace object/element with a new div
        replaceSwfWithEmptyDiv(targetID);
    }

    //Embed SWF
    if (swfobject.hasFlashPlayerVersion("7")) {
        attributes.data=url;
        var obj = swfobject.createSWF(attributes, params, targetID);
    }
}

function switchFlash() {
    //var flashMovie = getFlashMovieObject("myFlashMovie");
    //flashMovie.src = 'static/two.swf';
    loadSWF("static/flashtutorial_autofit.swf",'flashcontent');
    //flashMovie.LoadMovie(1, 'static/two.swf');
    //flashMovie.Play();
}

function StopFlashMovie() {
    swfobject.getObjectById('flashcontent').StopPlay();
}

function PlayFlashMovie() {
    swfobject.getObjectById('flashcontent').Play();
}


function RewindFlashMovie() {
    swfobject.getObjectById('flashcontent').Rewind();
}

function NextFrameFlashMovie() {
    var flashMovie =  swfobject.getObjectById('flashcontent');
    var totalFrames = flashMovie.TotalFrames();
    //// 4 is the index of the property for _currentFrame
    var currentFrame = flashMovie.CurrentFrame();

    var nextFrame = parseInt(currentFrame);
    if (nextFrame >= totalFrames)
        nextFrame = 0;
    flashMovie.Rewind(3);
}


function ZoominFlashMovie() {
    var flashMovie =  swfobject.getObjectById('flashcontent');
    flashMovie.Zoom(90);
}

function ZoomoutFlashMovie() {
    var flashMovie =  swfobject.getObjectById('flashcontent');
    flashMovie.Zoom(110);
}

function sendToJavaScript(val)
{
    alert(val);
}