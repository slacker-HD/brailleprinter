'use strict';

var funcs = {
    getattrCount: function (obj) {
        var i = 0;
        for (var j of obj) {
            console.log(j);
            i++;
        }
        return i;
    },
    gettextEdit: function (obj, index) {
        var html = '';
        for (var i in obj) {
            if (i === "\n") {
                html += "<br />";
            } else {
                var str = obj[i];
                var line1 = "",
                    line2 = "",
                    line3 = "";
                var count = this.getattrCount(str);
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
    },
    gettext: function (obj) {
        var html = '';
        for (var i in obj) {
            if (i === "\n") {
                html += "<br />";
            } else {
                var str = obj[i];
                var line1 = "",
                    line2 = "",
                    line3 = "";
                var count = this.getattrCount(str);
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
    },
    getprintcode: function (brailleString) {
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
    },
    ResultString: function (arg, editable) {
        var html = "";
        for (var i = 0; i < arg.length; i++) {
            html += editable === true ? this.gettextEdit(arg[i], i) : this.gettext(arg[i]);

        }
        return html;
    },
    //打印的时候字间空半格，一个英文字符一格，中文两格
    Paging: function (rowlength, collength) {
        var pages = 1;//页数
        var pagesepnums = [];//分页的终点标识
        var currentcol = 0, currentrow = 1;
        for (var i = 0; i < global.data.length; i++) {
            //判断是否该换行了
            if (currentcol + global.braille[i][global.data[i]].length * 2 > collength) {
                currentrow++;
                currentcol = 0;
                //判断是否该分页了
                if (currentrow > rowlength) {
                    pages++;
                    pagesepnums[pagesepnums.length] = i;
                    //重置新页
                    currentrow = 1;
                }
            }
            if (global.data[i] === '\n') {
                currentcol = collength;
            }
            else {
                //打完字空一个
                currentcol += global.braille[i][global.data[i]].length * 2 + 1;
            }
        }
        return [pages,pagesepnums];
    }
};
module.exports = funcs;