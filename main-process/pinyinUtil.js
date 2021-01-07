   'use strict';

   var pinyinUtil = {
       dict: {},
       isChinese: function(c) {
           return (/[\u4e00-\u9fa5]+/).test(c) ? true : false;
       },
       parseDict: function(pinyin_dict_withtone) {
           this.dict.withtone = {};
           var temp = pinyin_dict_withtone.split(',');
           for (var i = 0, len = temp.length; i < len; i++) {
               // 这段代码耗时28毫秒左右，对性能影响不大，所以一次性处理完毕
               this.dict.withtone[String.fromCharCode(i + 19968)] = temp[i]; // 这里先不进行split(' ')，因为一次性循环2万次split比较消耗性能
           }

           // 将字典文件解析成拼音->汉字的结构
           // 与先分割后逐个去掉声调相比，先一次性全部去掉声调然后再分割速度至少快了3倍，前者大约需要120毫秒，后者大约只需要30毫秒（Chrome下）
           var notone = pinyinUtil.removeTone(pinyin_dict_withtone).split(',');
           var py2hz = {},
               py,
               hz;
           for (var i = 0, len = notone.length; i < len; i++) {
               hz = String.fromCharCode(i + 19968); // 汉字
               // = aaa[i];
               py = notone[i].split(' '); // 去掉了声调的拼音数组
               for (var j = 0; j < py.length; j++) {
                   py2hz[py[j]] = (py2hz[py[j]] || '') + hz;
               }
           }
           this.dict.py2hz = py2hz;
       },
       getPinyin: function(chinese, withtone) {
           if (!chinese || /^ +$/g.test(chinese)) return '';
           withtone = withtone == undefined ? true : withtone;
           var result;
           var pinyin = this.dict.withtone[chinese];
           if (pinyin) {
               pinyin = pinyin.replace(/ .*$/g, ''); // 如果不需要多音字
               var tmp = pinyin.split(' ');
               pinyin = tmp[0];
               if (!withtone)
                   pinyin = this.removeTone(pinyin); // 如果不需要声调
           }
           result = pinyin || chinese;
           return result;
       },
       getMultiPinyin: function(chinese) {
           if (!chinese || /^ +$/g.test(chinese)) return '';
           var result;
           var pinyin = this.dict.withtone[chinese];
           result = pinyin || chinese;
           result = result.split(" ");
           return result;
       },
       removeTone: function(pinyin) {
           var toneMap = {
               "ā": "a1",
               "á": "a2",
               "ǎ": "a3",
               "à": "a4",
               "ō": "o1",
               "ó": "o2",
               "ǒ": "o3",
               "ò": "o4",
               "ē": "e1",
               "é": "e2",
               "ě": "e3",
               "è": "e4",
               "ī": "i1",
               "í": "i2",
               "ǐ": "i3",
               "ì": "i4",
               "ū": "u1",
               "ú": "u2",
               "ǔ": "u3",
               "ù": "u4",
               "ü": "v0",
               "ǖ": "v1",
               "ǘ": "v2",
               "ǚ": "v3",
               "ǜ": "v4",
               "ń": "n2",
               "ň": "n3",
               "": "m2"
           };
           return pinyin.replace(/[āáǎàōóǒòēéěèīíǐìūúǔùüǖǘǚǜńň]/g, function(m) { return toneMap[m][0]; });
       }
   };
   module.exports = pinyinUtil;