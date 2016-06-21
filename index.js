/**
 * Created by Administrator on 2016/6/15.
 */
var app = nodeRequire('electron').remote.app;

var event = nodeRequire('events');
var EventEmitter = nodeRequire('events').EventEmitter;
var emitter = new EventEmitter();

var fs = nodeRequire('fs');
var path = nodeRequire('path');

var recursive = nodeRequire('recursive-readdir');

var StateMachine = nodeRequire("./lib/state-machine.min.js");
var config = nodeRequire('./config');

var SerialPort = nodeRequire("./lib/serialport");
var gallary = nodeRequire('./lib/gallary');
var flash = nodeRequire('./lib/flash');

var intervId = null;

var timerGallary = null;//图片操作定时器
var timerNoCmd = null;//待机定时器
var honorFiles = null;//宣传视频目录文件数组
var currId=0;//当前宣传视频目录下正在播放的文件索引号

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
        //{name: '播放完成指令', from: '宣传视频', to: '一级界面'},

        {name: '返回指令', from: '荣誉墙', to: '一级界面'},
        {name: '超时指令', from: '荣誉墙', to: '待机界面'},

        ////////////////////////////////////////////////////////////////
        {name: '领导关怀指令', from: '荣誉墙', to: '领导关怀'},
        {name: '主题活动指令', from: '荣誉墙', to: '主题活动'},

        {name: '超时指令', from: '领导关怀', to: '荣誉墙'},
        {name: '超时指令', from: '主题活动', to: '荣誉墙'},

        {name: '返回指令', from: '领导关怀', to: '荣誉墙'},
        {name: '返回指令', from: '主题活动', to: '荣誉墙'},

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
        {name: '地震展区指令', from: '展区简介', to: '地震展区'},
        {name: '地震体验小屋指令', from: '展区简介', to: '地震体验小屋'},

        {name: '返回指令', from: '儿童科技乐园', to: '展区简介'},
        {name: '返回指令', from: '儿童展区', to: '展区简介'},
        {name: '返回指令', from: '基础科学展区', to: '展区简介'},
        {name: '返回指令', from: '电磁探秘', to: '展区简介'},
        {name: '返回指令', from: '科学表演', to: '展区简介'},
        {name: '返回指令', from: '声光体验', to: '展区简介'},
        {name: '返回指令', from: '数学魅力', to: '展区简介'},
        {name: '返回指令', from: '数字生活', to: '展区简介'},
        {name: '返回指令', from: '运动旋律', to: '展区简介'},
        {name: '返回指令', from: '地震展区', to: '展区简介'},
        {name: '返回指令', from: '地震体验小屋', to: '展区简介'},

        {name: '超时指令', from: '儿童科技乐园', to: '待机界面'},
        {name: '超时指令', from: '儿童展区', to: '待机界面'},
        {name: '超时指令', from: '基础科学展区', to: '待机界面'},
        {name: '超时指令', from: '电磁探秘', to: '待机界面'},
        {name: '超时指令', from: '科学表演', to: '待机界面'},
        {name: '超时指令', from: '声光体验', to: '待机界面'},
        {name: '超时指令', from: '数学魅力', to: '待机界面'},
        {name: '超时指令', from: '数字生活', to: '待机界面'},
        {name: '超时指令', from: '运动旋律', to: '待机界面'},
        {name: '超时指令', from: '地震展区', to: '待机界面'},
        {name: '超时指令', from: '地震体验小屋', to: '待机界面'}
        //{name: '播放完成指令', from: '儿童科技乐园', to: '展区简介'},
        //{name: '播放完成指令', from: '儿童展区', to: '展区简介'},
        //{name: '播放完成指令', from: '基础科学展区', to: '展区简介'},
        //{name: '播放完成指令', from: '电磁探秘', to: '展区简介'},
        //{name: '播放完成指令', from: '科学表演', to: '展区简介'},
        //{name: '播放完成指令', from: '声光体验', to: '展区简介'},
        //{name: '播放完成指令', from: '数学魅力', to: '展区简介'},
        //{name: '播放完成指令', from: '数字生活', to: '展区简介'},
        //{name: '播放完成指令', from: '运动旋律', to: '展区简介'}
    ]
});

/////////////////////////////////////////////////////
function startNoCmdTimer() {
    if (timerNoCmd == null) {
        console.log('开启无操作定时器');
        timerNoCmd = setTimeout(()=>fsm.超时指令(), config.timeout);
    }
}

function stopNoCmdTimer() {
    if (timerNoCmd) {
        clearTimeout(timerNoCmd);
        timerNoCmd = null;
    }
}

function intervalFlashOverTimer() {
    if (intervId == undefined)
        intervId = setInterval(isPlayOver, 1000);
}

function stopIntervalFlash() {
    if (intervId) {
        clearInterval(intervId);
        intervId = null;
    }
}

function startGallaryNoCmdTimer() {
    if (timerGallary == null) {
        console.log('开启图片浏览无操作定时器');
        timerGallary = setTimeout(()=>fsm.超时指令(), config.pictimeout);
    }
}

function stopGallaryNoCmdTimer() {
    if (timerGallary) {
        clearTimeout(timerGallary);
        timerGallary = null;
    }
}
//////////////////////////////////////////////////////

emitter.on('err', (e)=> {
    alert(e);
    return app.quit();
});

function isPlayOver() {
    var flashMovie = flash.FlashObj();
    var totalFrames = flashMovie.TotalFrames();
    //// 4 is the index of the property for _currentFrame
    var currentFrame = flashMovie.CurrentFrame();
    //console.log(currentFrame+':'+totalFrames);
    if (currentFrame + 1 >= totalFrames) {
        //if (fsm.can('播放完成指令')) {
        //    console.log('play over');
        //    fsm.播放完成指令();
        //}
        console.log('播放完成');

        stopIntervalFlash();

        if (fsm.can('超时指令')) {
            startNoCmdTimer();
        }

        if(fsm.current =='宣传视频')
        {
            playDirNext();
        }
    }
}

function playSwf(file) {
    console.log('播放文件：' + file);
    flash.loadSWF(file, 'flashcontent');

    intervalFlashOverTimer();
}

fsm.onenterstate = function (event, from, to) {
    console.log('进入' + to);
    stopNoCmdTimer();

    if(to =='宣传视频')
    {
        //console.log('播放目录下所有视频文件')
    }
    else if(to=='领导关怀')
    {
        //playDirPics(path.join(__dirname,config.leaderDir));
    }
    else if(to =='主题活动')
    {
		//playDirPics(path.join(__dirname,config.topicDir));
    }
    else {//其他播放swf
        if (fs.existsSync(path.join(__dirname, config.swfDir, to + '.swf'))) {
            console.log(path.join(__dirname, config.swfDir, to + '.swf') + '文件存在');
            playSwf(path.join(__dirname, config.swfDir, to + '.swf'));

        }
        else
            console.error('该状态的文件不存在');
    }
};

function playDirPics(dir)
{
    //停止flash播放
    flash.StopFlashMovie();
    document.getElementById('flashcontent').style.display='none';

    clearInterval(intervId);
    intervId =null;

    //首先显示图片浏览器
    document.getElementById('gallary').style.display='block';

    //播放目录下图片
    gallary.showDirPics(dir);
}


function playDirNext()
{
    var count =honorFiles.length;

    if(count <=currId){
        fsm.返回指令();
        return;
    }

    if(!flash.IsSwf(honorFiles[currId]))
        return count = count+1;

    playSwf(honorFiles[currId]);

    currId++;
}

fsm.onleave宣传视频 = function (event, from, to) {
    //stopIntervalFlash();
};

fsm.onenter宣传视频 = function (event, from, to) {
    currId = 0;

    var dir =path.join(__dirname,config.honorDir);
    //遍历图片文件夹
    recursive(dir, function (err, files) {
        // Files is an array of filename
        if (err)
            console.error(err);

        honorFiles = files;
        playDirNext();
    });
};

fsm.onenter主题活动 = function (event, from, to) {
    console.log('进入主题活动');
    document.getElementById('my-title').innerText = '主题活动';
    playDirPics(path.join(__dirname,config.topicDir));
    startGallaryNoCmdTimer();
};

fsm.onenter领导关怀 = function (event, from, to) {
    console.log('进入领导关怀');
    document.getElementById('my-title').innerText = '领导关怀';
    playDirPics(path.join(__dirname,config.leaderDir));
    startGallaryNoCmdTimer();
};

//一旦有串口命令过来，立刻取消掉定时器，重新设置定时器，
//////////////////////////////////////////////////////////////

var cmdHandle = function (cmd) {
    console.log('data received: ' + cmd);
    cmd = 'C' + cmd;

    stopNoCmdTimer();
    stopGallaryNoCmdTimer();

    if(cmd ==config.ZOOM)
    {
        console.log('放大指令');
        gallary.zoomPic();
        startGallaryNoCmdTimer();
        return;
    }
    else if(cmd ==config.PREV)
    {
        console.log('上一张指令');
        gallary.prevPic();
        startGallaryNoCmdTimer();
        return;
    }
    else if(cmd ==config.NEXT)
    {
        console.log('下一张指令');
        gallary.nextPic();
        startGallaryNoCmdTimer();
        return;
    }

    fsm[config[cmd]]();
};

emitter.on('cmd', cmdHandle);

window.onload = function () {
    //首先隐藏图片浏览器
    document.getElementById('gallary').style.display='none';

    flash.loadSWF(path.join(__dirname, config.swfDir, config.waitSwf), 'flashcontent');
    //intervId = setInterval(isPlayOver, 500);

    SerialPort.readserialportport(config.COMMPORT,config.COMMbaudrate);
};

window.onunload = function () {
    SerialPort.closeserialportport();

    stopNoCmdTimer();
    stopGallaryNoCmdTimer();

    stopIntervalFlash();
};