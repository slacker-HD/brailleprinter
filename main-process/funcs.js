'use strict';


function getattrCount(obj) {
    var i = 0;
    for (var j in obj) {
        i++;
    }

    return i;
}

function gettextEdit(obj, index) {
    var html = '';
    for (var i in obj) {
        if (i === "\n") {
            html += "<br />";
        } else {
            var str = obj[i];
            var line1 = "",
                line2 = "",
                line3 = "";
            var count = getattrCount(str);
            // html = '<table bgcolor="white" cellspacing="1px" style="display:inline-block" class="tooltip" id=\'' + index + '\' data-tag=\'' + i + '\' onclick="tooltip.pop(this,this.getAttribute(\'data-tag\'))"><tr><td align="center">';
            html = '<table bgcolor="white" cellspacing="1px" style="display:inline-block" class="tooltip" id=\'' + index + '\' data-tag=\'' + i + '\'><tr><td align="center">';
            html += i + '<br/>';
            for (var j = 0; j < count; j++) {
                line1 += (str[j].indexOf("1") >= 0) ? "●" : "○";
                line1 += (str[j].indexOf("4") >= 0) ? "●" : "○";
                line2 += (str[j].indexOf("2") >= 0) ? "●" : "○";
                line2 += (str[j].indexOf("5") >= 0) ? "●" : "○";
                line3 += (str[j].indexOf("3") >= 0) ? "●" : "○";
                line3 += (str[j].indexOf("6") >= 0) ? "●" : "○";
            }
            html += line1 + '<br/>';
            html += line2 + '<br/>';
            html += line3 + '</td></tr></table>';
        }
    }
    return html;
}

function gettext(obj) {
    var html = '';
    for (var i in obj) {
        if (i === "\n") {
            html += "<br />";
        } else {
            var str = obj[i];
            var line1 = "",
                line2 = "",
                line3 = "";
            var count = getattrCount(str);
            html = '<table bgcolor="white" cellspacing="1px" style="display:inline-block"><tr><td align="center">';
            html += i + '<br/>';
            for (var j = 0; j < count; j++) {
                line1 += (str[j].indexOf("1") >= 0) ? "●" : "○";
                line1 += (str[j].indexOf("4") >= 0) ? "●" : "○";
                line2 += (str[j].indexOf("2") >= 0) ? "●" : "○";
                line2 += (str[j].indexOf("5") >= 0) ? "●" : "○";
                line3 += (str[j].indexOf("3") >= 0) ? "●" : "○";
                line3 += (str[j].indexOf("6") >= 0) ? "●" : "○";
            }
            html += line1 + '<br/>';
            html += line2 + '<br/>';
            html += line3 + '</td> </tr></table>';
        }
    }
    return html;
}


exports.getprintcode = (brailleString) => {
    var array = new Uint8Array(brailleString.length + 1);
    var i = 0;
    for (i = 0; i < brailleString.length; i++) {
        var x = ['0', '0', '0', '0', '0', '0', '0', '0'];
        var s = brailleString[i];
        for (var j = 0; j < s.length; j++) {
            x[8 - parseInt(s[j])] = "1";
        }
        array[i] = (parseInt(x.join(''), 2));
    }
    array[i] = (192);
    return array;
};


exports.ResultString = (arg, editable) => {
    var html = "";
    for (var i = 0; i < arg.length; i++) {
        html += editable === true ? gettextEdit(arg[i], i) : gettext(arg[i]);

    }
    return html;
};

exports.getattrCount = (obj)=> {
    var i = 0;
    for (var j in obj) {
        i++;
    }
    return i;
}