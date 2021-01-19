#include <stdio.h>
#include <sys/io.h>
#include <wiringSerial.h>
#include <wiringPi.h>

int main(int argc, char *argv[])
{
    FILE *fp;
    char line[50];
    wiringPiSetup();

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
        printf("input line:");
        fgets(line, 1000, fp);
        printf("%s", line);
    }
    fclose(fp);
    return 0;
}