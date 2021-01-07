'use strict';

var transAsc = {
    0: ["3456", "245"],
    1: ["3456", "1"],
    2: ["3456", "12"],
    3: ["3456", "14"],
    4: ["3456", "145"],
    5: ["3456", "15"],
    6: ["3456", "124"],
    7: ["3456", "1245"],
    8: ["3456", "125"],
    9: ["3456", "24"],
    a: ["1"],
    b: ["12"],
    c: ["14"],
    d: ["145"],
    e: ["15"],
    f: ["124"],
    g: ["1245"],
    h: ["125"],
    i: ["24"],
    j: ["245"],
    k: ["13"],
    l: ["123"],
    m: ["134"],
    n: ["1345"],
    o: ["135"],
    p: ["1234"],
    q: ["12345"],
    r: ["1235"],
    s: ["234"],
    t: ["2345"],
    u: ["136"],
    v: ["1236"],
    w: ["2456"],
    x: ["1346"],
    y: ["13456"],
    z: ["1356"]
};
var transPY1 = {
    b: ["12"],
    p: ["1234"],
    m: ["134"],
    f: ["124"],
    d: ["145"],
    t: ["2345"],
    n: ["1345"],
    l: ["123"],
    g: ["1245"],
    j: ["1245"],
    k: ["13"],
    q: ["13"],
    h: ["125"],
    x: ["125"],
    zh: ["34"],
    ch: ["12345"],
    sh: ["156"],
    r: ["245"],
    z: ["1356"],
    c: ["14"],
    s: ["234"]
};
var transPY2 = {
    a: ["35"],
    o: ["135"],
    e: ["26"],
    i: ["24"],
    yi: ["24"],
    u: ["136"],
    wu: ["136"],
    v: ["346"],
    yu: ["346"],
    er: ["1235"],
    ai: ["246"],
    ao: ["235"],
    ei: ["2346"],
    ou: ["12356"],
    ia: ["1246"],
    ya: ["1246"],
    iao: ["345"],
    yao: ["345"],
    ie: ["15"],
    ye: ["15"],
    iu: ["1256"],
    you: ["1256"],
    ua: ["123456"],
    wa: ["123456"],
    uai: ["13456"],
    wai: ["13456"],
    ui: ["2456"],
    wei: ["2456"],
    uo: ["135"],
    wo: ["135"],
    ue: ["23456"],
    yue: ["23456"],
    an: ["1236"],
    ang: ["236"],
    en: ["356"],
    eng: ["3456"],
    ian: ["146"],
    yan: ["146"],
    iang: ["1346"],
    yang: ["1346"],
    "in": ["126"],
    yin: ["126"],
    ing: ["16"],
    ying: ["16"],
    uan: ["12456"],
    wan: ["12456"],
    yuan: ["12456"],
    uang: ["2356"],
    wang: ["2356"],
    uen: ["25"],
    wen: ["25"],
    ong: ["256"] /*,van:["12346"]*/ ,
    // yuan: ["12346"],
    un: ["456"],
    yun: ["456"],
    iong: ["1456"],
    yong: ["1456"]
};
var symbol = {
    "。": ["5", "23"],
    ".": ["2"],
    "，": ["5"],
    ",": ["5"],
    "?": ["5", "3"],
    "？": ["5", "3"],
    "！": ["56", "2"],
    "!": ["56", "2"],
    "：": ["36"],
    ":": ["36"],
    "、": ["4"],
    "；": ["56"],
    ";": ["56"],
};
var brailleUtil = {
    braillestring: function (s, pinyinUtil) {
        var result = [];
        for (var i = 0; i < s.length; i++) {
            var c = s.charAt(i);
            var o = {};
            o[c] = [""];
            if (/[0-9a-z]/i.test(c)) {
                o[c] = transAsc[c.toLowerCase()];
                result.push(o);
            } else {
                var p = pinyinUtil.getPinyin(c, false);
                //判断是否为汉字，需要有个盲文表针对符号，还有一个回车段落的问题。
                if (/[a-z]/i.test(p)) {
                    o[c] = this.pinyintobrailles(p);
                } else {
                    for (var sy in symbol) {
                        if (sy === c) {
                            o[c] = symbol[sy];
                            break;
                        }
                    }
                }
                result.push(o);
            }
        }
        return (result);
    },
    pinyintobrailles: function (pinyin) {
        var t = [];
        var py;
        for (py in transPY1) {
            if (pinyin.indexOf(py) === 0) {
                t = transPY1[py];
                pinyin = pinyin.substr(py.length);
                break;
            }
        }
        if (t.length === 0) {
            t = ["23456"]; //韵母自成音节的时候，在声方需配写零声符
        }
        for (py in transPY2) {
            if (pinyin === py) {
                t = t.concat(transPY2[py]);
                break;
            }
        }
        return t;
    }
};
module.exports = brailleUtil;