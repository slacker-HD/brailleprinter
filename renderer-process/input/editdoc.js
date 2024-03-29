'use strict';
const ipc = require('electron').ipcRenderer;
const txtedit = document.getElementById('txtedit');
const editdoc_section = document.getElementById('editdoc-section');
const btnleft = document.getElementById('btnleft');
const btnright = document.getElementById('btnright');
// const ttsDiv = document.getElementById('div_audio');
const startprint = document.getElementById('startprint');
const portsetting = document.getElementById('portsetting');


var index = 0,
    total = 0;

function palindrome(str) {
    var arr = str.replace(/[\\|\/|\n\“|\”|\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g, "");
    return arr;
}

// function GetTTS(data) {
//     const ttsAudio = document.getElementById('tts_autio_id');
//     ttsDiv.removeChild(ttsAudio);
//     var au1 = '<audio id="tts_autio_id" controls>';
//     var sss = '<source id="tts_source_id" src="http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&spd=5&text=' + palindrome(data) + '" type="audio/mpeg">';
//     var au2 = '</audio>';
//     ttsDiv.innerHTML = au1 + sss + au2;
// }

function isChinese(c) {
    return (/[\u4e00-\u9fa5]+/).test(c) ? true : false;
}

function slide() {
    document.querySelector('.counter').innerHTML = (index + 1) + ' / ' + total;
    btnleft.setAttribute('data-state', index === 0 ? 'disabled' : '');
    btnright.setAttribute('data-state', index === total - 1 ? 'disabled' : '');
}

editdoc_section.addEventListener('editdoc_section_load', function () {
    index = 0;
    ipc.send('asynchronous-inittxtedit', []);
    ipc.send('asynchronous-refreshtxtedit', 0);
    ipc.send('asynchronous-getPorts', 0);

});

ipc.on('asynchronous-refreshtxtedit-reply', function (event, arg) {
    // GetTTS(require('electron').remote.getGlobal('data'));
    total = arg[1];
    if (total === 0) {
        total = 1;
    }
    txtedit.innerHTML = arg[0];
    slide();
    var tooltipelem = document.querySelectorAll('.tooltip');
    for (var i = 0; i < tooltipelem.length; i++) {
        if (isChinese(tooltipelem[i].getAttribute('data-tag'))) {
            tooltipelem[i].addEventListener('mouseover', function () {
                var html = ipc.sendSync('synchronous-gettooltips', [this.getAttribute('data-tag'), this.getAttribute('id')]);
                tooltip.pop(this, html);
                setTimeout(function () {
                    var pinyinelem = document.querySelectorAll('.pinyin');
                    for (var k = 0; k < pinyinelem.length; k++) {
                        pinyinelem[k].addEventListener('click', function () {
                            var indx = index === 0 ? parseInt(this.getAttribute('data-id')) : require('electron').remote.getGlobal('pagesepnums')[index - 1] + parseInt(this.getAttribute('data-id'));
                            ipc.send('asynchronous-changepinyin', [indx, this.getAttribute('data-pinyin')]);
                            ipc.send('asynchronous-refreshtxtedit', index);
                        });
                    }
                }, 50);
            });
        }
    }
});

btnleft.addEventListener('click', function () {
    index--;
    index = index < 0 ? 0 : index;
    ipc.send('asynchronous-refreshtxtedit', index);
});

btnright.addEventListener('click', function () {
    index++;
    index = index < total - 1 ? index : total - 1;
    ipc.send('asynchronous-refreshtxtedit', index);
});

startprint.addEventListener('click', function () {
    ipc.send('asynchronous-print', document.getElementById("portsetting").value);
});




ipc.on('asynchronous-getPorts-reply', function (event, arg) {
    portsetting.options.length = 0;
    for (var i = 0; i < arg.length; i++) {
        portsetting.add(new Option(arg[i], arg[i]));
    }
    portsetting.options[0].selected = "selected";
});