#include <stdio.h>
#include <string.h>

#ifdef __APPLE__
#include <sys/uio.h>
#else
#include <sys/io.h>
#include <wiringSerial.h>
#include <wiringPi.h>
#include <softPwm.h>
#endif

#define MOTOR1CTLPIN 8  // 电机1的控制引脚
#define MOTOR1STEPPIN 2 // 电机1 _step
#define MOTOR1DIRPIN 5  // 电机1转动方向
#define MOTOR2CTLPIN 9  // 电机2的控制引脚
#define MOTOR2STEPPIN 3 // 电机2 _step
#define MOTOR2DIRPIN 6  // 电机2转动方向
#define SERVOPIN 0      // 舵机控制引脚，需要pwm功能
#define RANGE 200       // 舵机的角度范围

const int _step = 250; // _step Length
int _x_pos, _y_pos;    // 打印针头当前位置

#ifdef __linux
//控制舵机来回一次
void holing()
{
    char pos;
    for (pos = 10; pos < RANGE; pos += 10)  // 从0度到180度运动
    {                                       // 每次步进一度
        softPwmWrite(SERVOPIN, pos);
        delay(50);
    }
    for (pos = RANGE; pos >= 10; pos -= 10) //从180度到0度运动
    {
        softPwmWrite(SERVOPIN, pos);
        delay(50);
    }
}
//控制电机行走，需要根据硬件修改
void xStep_forward(int Step)
{
    int x;
    digitalWrite(5, HIGH);     // Set Dir low
    digitalWrite(6, HIGH);     // Set Dir low
    for (x = 0; x < Step; x++) // Loop 2000 times
    {
        digitalWrite(2, HIGH);  // Output high
        digitalWrite(3, HIGH);  // Output high
        delayMicroseconds(300); // Wait 1/2 a ms
        digitalWrite(2, LOW);   // Output low
        digitalWrite(3, LOW);   // Output high
        delayMicroseconds(300); // Wait 1/2 a ms
    }
}
//控制电机行走，需要根据硬件修改
void xStep_backward(int Step)
{
    int x;
    digitalWrite(5, LOW);      // Set Dir low
    digitalWrite(6, LOW);      // Set Dir low
    for (x = 0; x < Step; x++) // Loop 2000 times
    {
        digitalWrite(2, HIGH);  // Output high
        digitalWrite(3, HIGH);  // Output high
        delayMicroseconds(300); // Wait 1/2 a ms
        digitalWrite(2, LOW);   // Output low
        digitalWrite(3, LOW);   // Output high
        delayMicroseconds(300); // Wait 1/2 a ms
    }
}
//控制电机行走，需要根据硬件修改
void yStep_forward(int Step)
{
    int x;
    digitalWrite(5, HIGH);     // Set Dir high
    digitalWrite(6, LOW);      // Set Dir high
    for (x = 0; x < Step; x++) // Loop 200 times
    {
        digitalWrite(2, HIGH);  // Output high
        digitalWrite(3, HIGH);  // Output high
        delayMicroseconds(300); // Wait 1/2 a ms
        digitalWrite(2, LOW);   // Output low
        digitalWrite(3, LOW);   // Output high
        delayMicroseconds(300); // Wait 1/2 a ms
    }
}
//控制电机行走，需要根据硬件修改
void yStep_backward(int Step)
{
    int x;
    digitalWrite(5, LOW);      // Set Dir low
    digitalWrite(6, HIGH);     // Set Dir low
    for (x = 0; x < Step; x++) // Loop 2000 times
    {
        digitalWrite(2, HIGH);  // Output high
        digitalWrite(3, HIGH);  // Output high
        delayMicroseconds(300); // Wait 1/2 a ms
        digitalWrite(2, LOW);   // Output low
        digitalWrite(3, LOW);   // Output high
        delayMicroseconds(300); // Wait 1/2 a ms
    }
}
//回车换行
void Return()
{
    xStep_backward(_x_pos * _step);
    _x_pos = 0;
    yStep_forward(_step * 4);
    _y_pos++;
}
//打印字符，传入长度为6的char数组，分别对应布莱叶盲文1-6
void printchar(char c[])
{
    if (c[0] == 1)
        holing();
    y_Step_forward(_step);
    if (c[1] == 1)
        holing();
    y_Step_forward(_step);
    if (c[2] == 1)
        holing();
    x_Step_forward(_step);
    y_Step_backward(_step * 2);
    _x_pos++;
    if (c[3] == 1)
        holing();
    y_Step_forward(_step);
    if (c[4] == 1)
        holing();
    y_Step_forward(_step);
    if (c[5] == 1)
        holing();
    x_Step_forward(_step);
    y_Step_backward(_step * 2);
    _x_pos++;
}

#endif

int main(int argc, char *argv[])
{
    FILE *fp;
    char line[24]; //应该最多只有12个的，乘以2以备以后扩展
    int i = 1;
    _x_pos = 0;
    _y_pos = 0;
    if (argc != 2)
    {
        printf("Please input the print file path as argument.\n");
        return -1;
    }
    fp = fopen(argv[1], "r");
    if (fp == NULL)
    {
        printf("Can not load the print file.");
        return -1;
    }

#ifdef __linux
    wiringPiSetup();
    //电机1的初始化
    pinMode(MOTOR1CTLPIN, OUTPUT);  // 电机1的控制引脚
    pinMode(MOTOR1STEPPIN, OUTPUT); // 电机1 _step
    pinMode(MOTOR1DIRPIN, OUTPUT);  // 电机1转动方向
    //电机2的初始化
    pinMode(MOTOR2CTLPIN, OUTPUT);  // 电机2的控制引脚
    pinMode(MOTOR2STEPPIN, OUTPUT); // 电机2 _step
    pinMode(MOTOR2DIRPIN, OUTPUT);  // 电机2转动方向

    digitalWrite(MOTOR1CTLPIN, HIGH); // 开始控制电机1
    digitalWrite(MOTOR2CTLPIN, HIGH); // 开始控制电机2
    //舵机机的初始化
    softPwmCreate(SERVOPIN, 10, RANGE); //创建一个使舵机转到90的pwm输出信号
    softPwmWrite(SERVOPIN, 10);
#endif
    while (!feof(fp))
    {
        printf("input line %d:\n", i);
        i++;
        fgets(line, 24, fp);
        if (strcmp(line, "BR\n") == 0)
        {
            printf("new line\n");
        }
        else
        {
            printf("line length:%lu\n", strlen(line));
            printf("line contents:%s", line);
        }
    }
    fclose(fp);
#ifdef __linux
    digitalWrite(MOTOR1CTLPIN, LOW); // 停止控制电机1
    digitalWrite(MOTOR2CTLPIN, LOW); // 停止控制电机2
#endif
    return 0;
}