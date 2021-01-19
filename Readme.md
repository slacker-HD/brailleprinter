# 布莱叶盲文打字机

使用树莓派（不限于，理论上香橙派等均可行）打造一个廉价的布莱叶盲文打字机。

数据格式说明：

上位机代码会生成一个txt文件用于打印，数据格式如下：

- 数据格式：通过布莱叶字符串数组填写8位char类型的后六位构成字符传输每个字符。例如：  
    文字  	布莱叶盲文        	二进制                   	字符串 
    数   	["156","136"]	[000011001,0000100101]	"1%"
    得到的每个字符串以11000000(192,À)结尾。即: "数" 这个字符将发送"1%À"长度为3的字符串给下位机。传输的数据字符二进制前两位为00，控制字符前两位为11。

控制字符定义:  

上位机：  

- 11000000(0XC0):表示一个布莱叶字符发送完毕; 
- 11000001(0XC1):表示回车换行；   
- 11000010(0XC2):表示一个页面打印完成，提示换纸；  
- 11000011(0XC3):表示终止打印任务；  
- 11000100(0XC4):表示打印任务正常结束;  

下位机：  

- "R":表示reset完毕;   
根据Serialport的官方文档（https://www.npmjs.com/package/serialport）:(Some devices, like the Arduino, reset when you open a connection to them. In such cases, immediately writing to the device will cause lost data as they wont be ready to receive the data. This is often worked around by having the Arduino send a "ready" byte that your Node program waits for before writing. You can also often get away with waiting around 400ms.)   
- "W":表示一个布莱叶文打印完毕;   

TODO

- 设定好数据传输标准，基础定义2017.7.11已完成，待功能完善后添加  
- 布莱叶字符串、汉字拼音库应保存在本地,同时开发对应的修改工具
- 多音字处理功能
- 转换后的布莱叶文应可保存，添加导入导出功能
- 设备硬件的设计，应增加批量打印功能，初步想法根据活字印刷和圆珠笔笔芯的探入弹出功能，做一个活字模具，先打印这个模具再利用模具进行批量打印  


