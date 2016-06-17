/**
 * Created by Administrator on 2016/6/15.
 */
var app = require('electron').remote.app;

var event = require('events');
var EventEmitter = require('events').EventEmitter;
var emitter = new EventEmitter();

var fs = require('fs');
var path = require('path');

var StateMachine = require("./lib/state-machine.min.js");
var config = require('./config');

var timer1 = null;//待机定时器

var flashvars = {};
var params = {
    wmode: "transparent",
    allowScriptAccess: "always",
    scale: "exactFit",
    play: true,
    loop: false,
    allowfullscreen: true,
    swliveconnect: true
};

var attributes = {width: "100%", height: "100%"};

function loadSWF(url, targetID) {
    //Check for existing SWF
    if (isObject(targetID)) {
        //replace object/element with a new div
        replaceSwfWithEmptyDiv(targetID);
    }

    //Embed SWF
    if (swfobject.hasFlashPlayerVersion("9")) {
        attributes.data = url;
        var obj = swfobject.createSWF(attributes, params, targetID);
    }
}

var fsm = StateMachine.create({
    initial: '待机界面',
    error: function (eventName, from, to, args, errorCode, errorMessage) {
        console.error('event ' + eventName + ' was naughty :- ' + errorMessage);
    },
    events: [
        {name: '一级界面指令', from: '待机界面', to: '一级界面'},
        {name: '超时指令', from: '一级界面', to: '待机界面'},

        {name: '展区简介指令', from: '一级界面', to: '展区简介'},
        {name: '宣传视频指令', from: '一级界面', to: '宣传视频'},
        {name: '荣誉墙指令', from: '一级界面', to: '荣誉墙'},

        {name: '返回指令', from: '展区简介', to: '一级界面'},
        {name: '超时指令', from: '展区简介', to: '待机界面'},

        {name: '返回指令', from: '宣传视频', to: '一级界面'},
        {name: '播放完成指令', from: '宣传视频', to: '一级界面'},

        {name: '返回指令', from: '荣誉墙', to: '一级界面'},
        {name: '超时指令', from: '荣誉墙', to: '待机界面'},

        ////////////////////////////////////////////////////////////////
        {name: '领导关怀指令', from: '荣誉墙', to: '领导关怀'},
        {name: '主题活动指令', from: '荣誉墙', to: '主题活动'},

        {name: '超时指令', from: '主题活动指令', to: '荣誉墙'},
        {name: '超时指令', from: '主题活动指令', to: '荣誉墙'},

        {name: '返回指令', from: '主题活动指令', to: '荣誉墙'},
        {name: '返回指令', from: '主题活动指令', to: '荣誉墙'},

        ////////////////////////////////////////////////////////////////
        {name: '儿童科技乐园指令', from: '展区简介', to: '儿童科技乐园'},
        {name: '儿童展区指令', from: '展区简介', to: '儿童展区'},
        {name: '基础科学展区指令', from: '展区简介', to: '基础科学展区'},
        {name: '电磁探秘指令', from: '展区简介', to: '电磁探秘'},
        {name: '科学表演指令', from: '展区简介', to: '科学表演'},
        {name: '声光体验指令', from: '展区简介', to: '声光体验'},
        {name: '数学魅力指令', from: '展区简介', to: '数学魅力'},
        {name: '数字生活指令', from: '展区简介', to: '数字生活'},
        {name: '运动旋律指令', from: '展区简介', to: '运动旋律'},

        {name: '返回指令', from: '儿童科技乐园', to: '展区简介'},
        {name: '返回指令', from: '儿童展区', to: '展区简介'},
        {name: '返回指令', from: '基础科学展区', to: '展区简介'},
        {name: '返回指令', from: '电磁探秘', to: '展区简介'},
        {name: '返回指令', from: '科学表演', to: '展区简介'},
        {name: '返回指令', from: '声光体验', to: '展区简介'},
        {name: '返回指令', from: '数学魅力', to: '展区简介'},
        {name: '返回指令', from: '数字生活', to: '展区简介'},
        {name: '返回指令', from: '运动旋律', to: '展区简介'},

        {name: '播放完成指令', from: '儿童科技乐园', to: '展区简介'},
        {name: '播放完成指令', from: '儿童展区', to: '展区简介'},
        {name: '播放完成指令', from: '基础科学展区', to: '展区简介'},
        {name: '播放完成指令', from: '电磁探秘', to: '展区简介'},
        {name: '播放完成指令', from: '科学表演', to: '展区简介'},
        {name: '播放完成指令', from: '声光体验', to: '展区简介'},
        {name: '播放完成指令', from: '数学魅力', to: '展区简介'},
        {name: '播放完成指令', from: '数字生活', to: '展区简介'},
        {name: '播放完成指令', from: '运动旋律', to: '展区简介'}
    ]
});

/////////////////////////////////////////////////////
//mywork
function readserialportport() {
    var SerialPort = require("serialport").SerialPort;
    var serialPort = new SerialPort(config.COMMPORT, {
        baudrate: config.COMMbaudrate,
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

emitter.on('err', (e)=> {
    alert(e);
    return app.quit();
});

function isPlayOver() {
    var flashMovie = swfobject.getObjectById('flashcontent');
    var totalFrames = flashMovie.TotalFrames();
    //// 4 is the index of the property for _currentFrame
    var currentFrame = flashMovie.CurrentFrame();
    //console.log(currentFrame+':'+totalFrames);
    if (currentFrame + 1 == totalFrames) {
        if (fsm.can('播放完成指令')) {
            console.log('play over');
            fsm.播放完成指令();
        }

        if (fsm.can('超时指令')) {
            if(timer1 ==null) {
                console.log('开启无操作定时器');
                timer1 = setTimeout(()=>fsm.超时指令(), config.timeout);
            }
        }
    }
}

function playSwf(file) {
    console.log('播放文件：' + file);
    loadSWF(file, 'flashcontent');
    console.log(swfobject.getObjectById('flashcontent').TotalFrames());
}

fsm.onenterstate = function (event, from, to) {
    console.log('进入' + to);
    if (fs.existsSync(path.join(__dirname, config.swfDir, to + '.swf'))) {
        console.log(path.join(__dirname, config.swfDir, to + '.swf') + '文件存在');
        playSwf(path.join(__dirname, config.swfDir, to + '.swf'));
    }
    else
        console.error('该状态的文件不存在');
};

fsm.onenter待机界面 = function (event, from, to) {
    console.log('进入待机界面');
};

//一旦有串口命令过来，立刻取消掉定时器，重新设置定时器，
//////////////////////////////////////////////////////////////
var cmdHandle = function (cmd) {
    console.log('data received: ' + cmd);
    cmd = 'C' + cmd;

    if (timer1) {
        clearTimeout(timer1);
        timer1 = null;
    }
    fsm[config[cmd]]();
};
emitter.on('cmd', cmdHandle);

var intervId = null;

window.onload = function () {
    loadSWF(path.join(__dirname, config.swfDir, config.waitSwf), 'flashcontent');

    intervId = setInterval(isPlayOver, 500);

    readserialportport();
};

window.onunload = function () {
    serialport.close();
    clearTimeout(timer1);
    clearInterval(intervId);
};