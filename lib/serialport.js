var SerialPort  =nodeRequire('serialport').SerialPort;

var serialPort = null;

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

function readserialportport(COMMPORT,COMMbaudrate) {
    serialPort = new SerialPort(COMMPORT, {
        baudrate: COMMbaudrate,
        autoOpen: true
    }, function (err) {
        if (err)
            return  emitter.emit('err', '串口打开失败:' + err.message);
    });

    serialPort.on("open", function (err) {
        if (err)
            return emitter.emit('err', '串口打开失败:' + err.message);

        console.log('open');
    });

    serialPort.on('data', function (data) {
        //alert(JSON.parse(data));
        var buff = new Buffer(data, 'utf8'); //no sure about this
        emitter.emit('cmd', buff.toString('hex'));
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
    if(serialport.isOpen())
        serialport.close();
}

module.exports={
    readserialportport,
    closeserialportport
};
