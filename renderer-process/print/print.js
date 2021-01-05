// 'use strict';
// const ipc = require('electron').ipcRenderer;
// const portsetting = document.getElementById('portsetting');
// const print_section = document.getElementById('print-section');
// const startprint = document.getElementById('startprint');
// const textareaprintpreview = document.getElementById('textareaprintpreview');
// const funcs = require('electron').remote.require('../../main-process/funcs');
// var datas = null;
// var datapos = 0;


// function printObject(obj) {
//     var temp = "";
//     for (var i in obj) {
//         temp += i + ":" + obj[i] + "\n";
//     }
//     alert(temp);
// }


// print_section.addEventListener('print_section_load', function (e) {
//     ipc.send('asynchronous-getport', []);
//     textareaprintpreview.innerHTML = '';
// })

// ipc.on('asynchronous-getport-reply', function (event, arg) {
//     var ports = require('electron').remote.getGlobal('ports');
//     clearSelect(portsetting);
//     for (var i = 0; i < ports.length; i++) {
//         jsAddItemToSelect(portsetting, ports[i], i);
//     }
// })

// function clearSelect(objSelect) {
//     objSelect.options.length = 0;
// }

// function jsAddItemToSelect(objSelect, objItemText, objItemValue) {
//     var option = document.createElement("option");
//     option.text = objItemText;
//     option.value = objItemValue;
//     objSelect.add(option, objSelect.options[null]);
// }

// startprint.addEventListener('click', function (e) {
//     datas = require('electron').remote.getGlobal('braille');
//     datapos = 0;
//     ipc.send('asynchronous-openport', [portsetting.options[portsetting.selectedIndex].text]);
// })


// function printchar() {
//     for (var index in datas[datapos]) {
//         var str = funcs.getprintcode((datas[datapos])[index]);
//         ipc.send('asynchronous-writechar', [str]);
//     }
//     // printObject(datas[datapos]);
// }


// ipc.on('asynchronous-openport-reply', function (event, arg) {
//     if (arg[0] === "OK") {
//         printchar();
//     } else {
//         alert("打印机设置错误,请保证打印机已连接并选择正确的端口");
//     }
// })

// ipc.on('asynchronous-writechar-reply', function (event, arg) {
//     var data = datas.slice(0, datapos);
//     textareaprintpreview.innerHTML = funcs.ResultString(data, true);
//     if (arg[0] === "OK") {
//         datapos++;
//         if (datapos < datas.length)
//             printchar();
//         else {
//             ipc.send('asynchronous-writechar', [0xc4]);
//             alert("打印完毕");
//         }

//     } else if (arg[0] === "DEVICE ERROR") {
//         alert("打印机设置错误,请保证打印机已连接并选择正确的端口");
//         datapos == 0;
//     } else {
//         datapos == 0;
//         alert("未知错误");
//     }
// })