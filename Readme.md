# 布莱叶盲文打字机

使用树莓派（不限于，理论上香橙派等均可行）打造一个廉价的布莱叶盲文打字机。

数据格式说明：

上位机代码根据当前页面内容会生成一个txt文件用于打印，文件名为当前系统时间，存储位置在系统临时目录下(linux为/tmp)。文本中每一行表示一个布莱叶字符，根据内容长短不一，数据格式如下：

- 101011010100\n:一个示例行，表示汉字“字”的内容(布莱叶盲文["1356","24"])。
- BR\n:表示回车换行；

下位机实质是c语言控制gpio的程序，与树莓派一体，主要传1个参数：

- arg1：传入txt文件；

TODO

- 设备硬件的设计，应增加批量打印功能，初步想法根据活字印刷和圆珠笔笔芯的探入弹出功能，做一个活字模具，先打印这个模具再利用模具进行批量打印


安装了serialport,所以首次安装需要electron-rebuild，已在package.json里面写了脚本。
