var app = require('app');
var BrowserWindow = require('browser-window');
var path = require('path');
var conf = require('./config');
var fs = require('fs');

var mainWindow = null;
app.commandLine.appendSwitch('ppapi-flash-path', __dirname + '/plugins/pepflashplayer.dll');

//var child =null;

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    //child.kill('SIGTERM');
    app.quit();
});

const ppflashsolpath ='/Pepper Data/Shockwave Flash/WritableRoot/#SharedObjects/KMED3JYF/macromedia.com/support/flashplayer/sys';


app.on('ready', function () {

    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        frame: !conf.ISPRODUCT,
        kiosk: conf.ISPRODUCT,
        fullscreen:conf.ISPRODUCT,
        alwaysOnTop:true,
            'auto-hide-menu-bar': true,
        'use-content-size': true,
        'web-preferences': {
            'plugins': true,
            'web-security': false
        }
    });

    //mainWindow.loadURL('file://' + __dirname + '/index.html');
	mainWindow.loadURL('file://' + __dirname + '/gallary/index.html');
    //mainWindow.loadURL('http://www.macromedia.com/support/documentation/en/flashplayer/help/settings_manager04.html');//flash测试
    mainWindow.focus();
    if(!conf.ISPRODUCT)
        mainWindow.openDevTools();
    else
        mainWindow.maximize();

});
