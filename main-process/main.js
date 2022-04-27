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
const os = require('os');
const fs = require('fs');
const serialport = require("serialport").SerialPort;
var SerialPrint;

const {
    execFile
} = require('child_process');

var currentPos = 0; //记录文字的位置
var letterPos = 0;//单双盲文位置
var currentRow = 0;//当前行
var currentCol = 0;//当前列

const RETURNCODE_FIN = 0x46;


var mainWindow = null;
var isPrinter = false;
function initialize() {
    pinyinUtil.parseDict(pinyin_dict_withtone);
    global.data = "";
    global.braille = [];
    global.Postion = [];

    //这里初始化设置默认打印行和列
    global.row = 27;
    global.col = 60;//列要除以2

    app.name = '布莱叶盲文打印编辑系统';

    function createWindow() {
        var windowOptions = {
            width: 1024,
            minWidth: 980,
            height: 600,
            minHeight: 480,
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
        // mainWindow.webContents.openDevTools();

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
        try {
            SerialPrint.close();
        } catch (error) {
            console.log(error);
        }
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

//传入参数arg为输入文本，一个string值
ipc.on('asynchronous-sendtextfastpreview', function (event, arg) {
    global.data = arg;
    var text = rightsubstring(arg, 200);
    event.sender.send('asynchronous-sendtextfastpreview-reply', funcs.PreviewString(brailleUtil.braillestring(text, pinyinUtil)));
});

ipc.on('asynchronous-inittxtedit', function () {
    global.braille = brailleUtil.braillestring(global.data, pinyinUtil);
    var tmp = funcs.Paging(global.row, global.col);
    global.pages = tmp[0];
    global.pagesepnums = tmp[1];
    funcs.PrintCode(0);
});

//传入参数arg为当前页面，一个int值
ipc.on('asynchronous-refreshtxtedit', function (event, arg) {
    var length = global.pages;
    var data;
    var start = arg === 0 ? 0 : global.pagesepnums[arg - 1];
    data = global.braille.slice(start, global.pagesepnums[arg]);
    event.sender.send('asynchronous-refreshtxtedit-reply', [funcs.EditString(data, global.col, start), length]);
});

//传入参数arg为当前文字的值和所在页面的第几个字，数组类型[int,string]
ipc.on('asynchronous-changepinyin', function (event, arg) {
    var index = arg[0];
    var content = brailleUtil.pinyintobrailles(pinyinUtil.removeTone(arg[1]));
    (global.braille[index])[global.data[index]] = content;
});

//传入参数arg为当前文字的值和所在页面的第几个字，数组类型[int,string]
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

// function WritePrintFile(Filename, Content) {
//     fs.writeFileSync(Filename, Content, function (err) {
//         if (err) {
//             return -1;
//         }
//         console.log("The file was saved!");
//         return 0;
//     });
// }

// function Print(file) {
//     var exef;
//     if (fs.existsSync("./assets/a.out")) {
//         exef = "./assets/a.out";

//     }
//     else {
//         exef = global.data.apppath + "/../a.out";
//     }
//     const print = execFile(exef, [file,], (error, stdout) => {
//         console.log(stdout);
//     });
//     print.on('exit', (code) => {
//         console.log("exit:" + code);
//     });
// }

//生成打印文件，传入当前页面，从0开始
ipc.on('asynchronous-generateprinttxt', function (event, arg) {
    var data;
    var start = arg === 0 ? 0 : global.pagesepnums[arg - 1];
    data = global.braille.slice(start, global.pagesepnums[arg]);
    var content = funcs.PrintCode(data, global.col, start);

    var curdate = new Date();
    var filepath = path.join(os.tmpdir(), "/Braille " + curdate + ".txt");

    // WritePrintFile("a.txt", content);
    WritePrintFile(filepath, content);
    Print(filepath);
});

ipc.on('asynchronous-getPorts', function (event, arg) {
    var AviablePorts = new Array;
    serialport.list().then(
        ports => {
            ports.forEach(function (port) {
                AviablePorts[AviablePorts.length] = port.path;
            })
            event.sender.send('asynchronous-getPorts-reply', AviablePorts);
        }
    )
});

function PrintChar() {
    var buf;
    var temstr;


    temstr = global.braille[currentPos][global.data[currentPos]][letterPos];
    letterPos++;

    //需要判断当前行和列


    if (letterPos > global.braille[currentPos][global.data[currentPos]].length - 1) {
        letterPos = 0;
        currentPos++;
    }






    buf = Buffer.alloc(5);

    buf.writeUInt8(0b00000000, 0);
    buf.writeUInt8(0x42, 1);
    buf.writeUInt8(0x86, 2);
    buf.writeUInt8(0xdc, 3);

    buf.writeUInt8(0xff, 4);

    console.log(temstr);

    SerialPrint.write(buf);
}

function StartAndPrint(port) {

    if (isPrinter !== true) {
        SerialPrint = new serialport({ path: port, baudRate: 9600 });
        SerialPrint.write("READY");
    }
    SerialPrint.on('data', function (data) {

        console.log(data);
        //握手成功
        if (data.toString() == "READY") {
            isPrinter = true;
            currentPos = 0;
            letterPos = 0;
            currentRow = 0;
            currentCol = 0;
            if (global.data.length > 0) {
                PrintChar();
            }
        }
        // 返回完成，打印下一个
        if (data[0] == RETURNCODE_FIN) {
            if (currentPos == global.data.length) {
                //打印完成，复原
                currentPos = 0;
                letterPos = 0;
                currentRow = 0;
                currentCol = 0;
            }
            else {
                PrintChar();
            }
        }
    });

    SerialPrint.on('error', function (err) {
        console.log('Error: ', err.message);
    })
}

ipc.on('asynchronous-print', function (event, arg) {
    if (isPrinter) {
        if (global.data.length > 0) {
            PrintChar();
        }
    }
    else {
        StartAndPrint(arg);
    }

});