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
                html += "<br /><br />";
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
    getprintcode: function (obj) {
        var txt = '';
        for (var i in obj) {
            if (i === "\n") {
                html += "<br />";
            } else {
                var str = obj[i];
                var count = this.getattrCount(str);
                var line = "";
                for (var j = 0; j < count; j++) {
                    line += (str[j].indexOf("1") >= 0) ? "1" : "0";
                    line += (str[j].indexOf("2") >= 0) ? "1" : "0";
                    line += (str[j].indexOf("3") >= 0) ? "1" : "0";
                    line += (str[j].indexOf("4") >= 0) ? "1" : "0";
                    line += (str[j].indexOf("5") >= 0) ? "1" : "0";
                    line += (str[j].indexOf("6") >= 0) ? "1" : "0";
                }
                txt += line + '\n';
            }
        }
        return txt;
    },
    //快速预览字符串,参数为输入的文字对象
    PreviewString: function (arg) {
        var html = "";
        for (var i = 0; i < arg.length; i++) {
            html += this.gettext(arg[i]);
        }
        return html;
    },
    //编辑打印的字符串
    EditString: function (data, collength, start) {
        var html = "";
        var rows = this.Rowing(data, collength, start);
        for (var i = 0; i < data.length; i++) {
            if (rows.length > 0) {
                if (i === rows[0]) {
                    html += "<br />";
                    rows.shift();
                }
            }
            html += this.gettextEdit(data[i], i);
        }
        return html;
    },
    //生成用于打印的txt字符串
    PrintCode: function (data, collength, start) {
        var txt = "";
        var rows = this.Rowing(data, collength, start);
        for (var i = 0; i < data.length; i++) {
            if (rows.length > 0) {
                if (i === rows[0]) {
                    txt += "BR\n";
                    rows.shift();
                }
            }
            txt += this.getprintcode(data[i]);
        }
        return txt;
    },
    //打印的时候字间空半格，一个英文字符一格，中文两格
    Paging: function (rowlength, collength) {
        var pages = 1;//页数
        var pagesepnums = [];//分页的终点标识
        global.Postion = [];
        var currentcol = 0, currentrow = 1;
        for (var i = 0; i < global.data.length; i++) {

            var Postion = new Object();

            //判断是否该分页了，因为行数是从1开始，所以要加1
            if (currentrow === rowlength + 1) {
                pages++;
                //记录当业最后一个字符位置
                pagesepnums[pagesepnums.length] = i - 1;
                //重置新页
                currentrow = 1;
            }

            //判断是否该换行了
            if (currentcol + global.braille[i][global.data[i]].length * 2 > collength) {
                currentrow++;
                currentcol = 0;
            }

            if (global.data[i] === '\n') {
                //一行最后一个回车注意不要多次换行
                // currentcol = currentcol === 0 ? 0 : collength;
                currentrow++;
                currentcol = 0;
            }
            else {
                //打完字空一个
                currentcol += global.braille[i][global.data[i]].length * 2;
            }

            Postion.col = currentcol / 2;
            Postion.row = currentrow;
            global.Postion[i] = Postion;
        }
        pagesepnums[pages - 1] = global.data.length;
        return [pages, pagesepnums];
    },
    Rowing: function (data, collength, start) {
        var currentcol = 0;
        var rowsepnums = [];//分行的终点标识

        for (var i = 0; i < data.length; i++) {
            if (currentcol + global.braille[i + start][global.data[i + start]].length * 2 > collength) {
                currentcol = 0;
                rowsepnums[rowsepnums.length] = i;
            }
            if (global.data[i + start] === '\n') {
                //一行最后一个回车注意不要多次换行
                currentcol = currentcol === 0 ? 0 : collength;
            }
            else {
                //打完字空一个
                currentcol += global.braille[i + start][global.data[i + start]].length * 2;
            }
        }
        return rowsepnums;
    }
};
module.exports = funcs;





// gettcol: function (index) {
//     var textcol = 0;
//     for (var i = 0; i < global.rows.length; i++) {
//         if (index > global.rows[i]) {
//             textcol = index - global.rows[i];

// //                 //再次循环找对应的列
// //                 for (var j = global.braille.)

// // //逻辑有问题，应该是累加然后判断
// //                 break;
//         }
//     }



//     return 0;
// },
// //有逻辑bug，这是文字的行
// gettextrow: function (index) {
//     for (var i = 0; i < global.rows.length; i++) {
//         if (index > global.rows[i]) {
//             return index - global.rows[i];
//         }
//     }
//     return 0;
// },
// PrintCode: function (index) {
//     var tmp;
//     var buf = Buffer.alloc(5);
//     buf.writeUInt8(0b00000000, 0);

//     var row = this.getrow(index);
//     tmp = 0b01000000 | row;
//     buf.writeUInt8(tmp, 1);

//     var col = this.getrcol(index);
//     tmp = 0b01000000 | col;
//     buf.writeUInt8(tmp, 2);
// }