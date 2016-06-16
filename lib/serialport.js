
function enumserialport() {
    var serialPort = require("serialport");
    serialPort.list(function (err, ports) {
        ports.forEach(function (port) {
            console.log(port.comName);
            console.log(port.pnpId);
            console.log(port.manufacturer);
        });
    });
}
function readserialportport() {
    var SerialPort = require("serialport").SerialPort
    var serialPort = new SerialPort("com3", {
        baudrate: 9600,
        autoOpen: true
    });

    serialPort.on("open", function (err) {
        if (err) {
            alert('串口打开失败:'+err.message);
            return console.log('Error opening port: ', err.message);
        }
        console.log('open');
        serialPort.on('data', function (data) {
            //alert(JSON.parse(data));
            var buff = new Buffer(data, 'utf8'); //no sure about this
            console.log('data received: ' + buff.toString('hex'));
        });
    });
}

function writeserialportport() {
    var SerialPort = require("serialport").SerialPort
    var serialPort = new SerialPort("com3", {
        baudrate: 9600
    });

    serialPort.on("open", function () {
        console.log('open');
        serialPort.write("this is from Node serialPort!\n", function (err, results) {
            console.log('err ' + err);
            console.log('results ' + results);
        });
    });
}

function closeserialportport() {
    var SerialPort = require("serialport").SerialPort
    var serialPort = new SerialPort("com3", {
        baudrate: 9600
    });

    serialPort.close();
}


function getTextFromFlash(str) {
    alert(str);
    return str;
}
//    document.addEventListener("keydown", myFunction);
//
//    function myFunction() {
//        alert('sss');
//    }

//    document.onclick = myClickHandler;
//    function myClickHandler() {
//        alert("The document was clicked!");
//    }

function getFlashMovieObject(movieName) {
    if (window.document[movieName]) {
        return window.document[movieName];
    }
    if (navigator.appName.indexOf("Microsoft Internet") == -1) {
        if (document.embeds && document.embeds[movieName])
            return document.embeds[movieName];
    }
    else // if (navigator.appName.indexOf("Microsoft Internet")!=-1)
    {
        return document.getElementById(movieName);
    }
}

function SendDataToFlashMovie() {
    var flashMovie = getFlashMovieObject("myFlashMovie");
    flashMovie.SetVariable("/:message", document.controller.Data.value);
}

function ReceiveDataFromFlashMovie() {
    var flashMovie = getFlashMovieObject("myFlashMovie");
    var message = flashMovie.GetVariable("/:message");
    document.controller.Data.value = message;
}

function sendToActionScript(value) {
    // thisMovie("ExternalInterfaceExample").sendToActionScript(value);
}

