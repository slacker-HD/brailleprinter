'use strict';
const path = require('path');
const electron = require('electron');
const ipc = require('electron').ipcMain;
const BrowserWindow = electron.BrowserWindow;
const app = electron.app;
const brailleUtil = require('./brailleUtil');
const pinyinUtil = require('./pinyinUtil');
const funcs = require('./funcs');
const pinyin_dict_withtone = require('./dict/pinyin_dict_withtone');

var mainWindow = null;

function initialize() {
    pinyinUtil.parseDict(pinyin_dict_withtone);
    global.data = "";
    global.braille = [];

    app.name = '布莱叶盲文打印编辑系统';

    function createWindow() {
        var windowOptions = {
            width: 1080,
            minWidth: 980,
            height: 840,
            minHeight: 600,
            title: app.name,
            webPreferences: {
                nodeIntegration: true,
                enableRemoteModule: true
            }
        };

        if (process.platform === 'linux') {
            windowOptions.icon = path.join(__dirname, '/assets/app-icon/png/64.png');
        }

        mainWindow = new BrowserWindow(windowOptions);
        mainWindow.loadURL(path.join('file://', __dirname, '../index.html'));
        mainWindow.setMenu(null);
        global.mainWindow = mainWindow;
        mainWindow.on('closed', function () {
            mainWindow = null;
        });
        mainWindow.webContents.openDevTools();

    }

    app.on('ready', function () {
        createWindow();
    });

    app.on('window-all-closed', function () {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });

    app.on('activate', function () {
        if (mainWindow === null) {
            createWindow();
        }
    });

    app.on('quit', function () {
        console.log("quit");
    });
}

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
    app.quit();
} else {
    app.on('second-instance', (commandLine, workingDirectory) => {
        console.log(commandLine);
        console.log(workingDirectory);
        if (mainWindow) {
            if (mainWindow.isMinimized()) {
                mainWindow.restore();
            }
            mainWindow.focus();
        }
    });
}

initialize();

function rightsubstring(str, length) {
    var text = str.length > length ? str.substr(str.length - length, length) : str;
    return text;
}

ipc.on('asynchronous-sendtextfastpreview', function (event, arg) {
    global.data = arg[0];
    var text = rightsubstring(arg[0], 200);
    event.sender.send('asynchronous-sendtextfastpreview-reply', funcs.ResultString(brailleUtil.braillestring(text, pinyinUtil), false));
});

ipc.on('asynchronous-inittxtedit', function () {
    global.braille = brailleUtil.braillestring(global.data, pinyinUtil);
});

ipc.on('asynchronous-refreshtxtedit', function (event, arg) {
    var length = global.data.length % 400 === 0 ? parseInt(global.data.length / 400) : parseInt(global.data.length / 400 + 1);
    var data = global.braille.slice(arg[0] * 400, arg[0] * 400 + 400);
    event.sender.send('asynchronous-refreshtxtedit-reply', [funcs.ResultString(data, true), length]);
});

ipc.on('asynchronous-changepinyin', function (event, arg) {
    var index = arg[0];
    var content = brailleUtil.pinyintobrailles(pinyinUtil.removeTone(arg[1]));
    (global.braille[index])[global.data[index]] = content;
});

ipc.on('synchronous-gettooltips', function (event, arg) {
    var html = "";
    var strs = pinyinUtil.getMultiPinyin(arg[0]);
    for (var j = 0; j < strs.length; j++) {
        var braille = brailleUtil.pinyintobrailles(pinyinUtil.removeTone(strs[j]));
        var line1 = "",
            line2 = "",
            line3 = "";
        var count = funcs.getattrCount(braille);
        html += '<table bgcolor="white" cellspacing="1px" style="display:inline-block" class="pinyin" data-id="' + arg[1] + '" data-pinyin="' + strs[j] + '" ><tr><td align="center">';
        html += strs[j] + '<br/>';
        for (var k = 0; k < count; k++) {
            line1 += (braille[k].indexOf("1") >= 0) ? "●" : "○";
            line1 += (braille[k].indexOf("4") >= 0) ? "●" : "○";
            line2 += (braille[k].indexOf("2") >= 0) ? "●" : "○";
            line2 += (braille[k].indexOf("5") >= 0) ? "●" : "○";
            line3 += (braille[k].indexOf("3") >= 0) ? "●" : "○";
            line3 += (braille[k].indexOf("6") >= 0) ? "●" : "○";
        }
        html += line1 + '<br/>';
        html += line2 + '<br/>';
        html += line3 + '</td></tr></table>';
    }
    event.returnValue = html;
});