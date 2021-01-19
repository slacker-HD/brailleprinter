#include <stdio.h>
#ifdef __APPLE__
#include <sys/uio.h>
#else
#include <sys/io.h>
#include <wiringSerial.h>
#include <wiringPi.h>
#endif

int main(int argc, char *argv[])
{
    FILE *fp;
    char line[24]; //应该最多只有12个的，乘以2以备以后扩展
    int i = 1;
#ifdef __linux
    wiringPiSetup();
#endif

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

    while (!feof(fp))
    {
        printf("input line %d:",i);
        i++;
        fgets(line, 1000, fp);
        printf("%s", line);
    }
    fclose(fp);
    return 0;
}