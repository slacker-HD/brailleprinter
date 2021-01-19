#include <stdio.h>
#include <sys/io.h>

int main(int argc,char *argv[])
{
    FILE *fp;
    char line[50];
    if(arcg != 0)
    {
        printf("Please input the print file path as argument.\n");
        return -1;
    }
    if (!access(argv[0],0))
    {
        printf("The print file does not exist.\n");
        return -1;
    }
    fp=fopen(argv[0],"r");
    if(fp == NULL)
    {
        printf("Can not load the print file.");
        return -1;
    }
    while(!feof(fp))
    {
        fgets(line,1000,fp);
        printf("%s",line);
    }
    fclose(fp);
    return 0;
}