#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define SUCCESS                        0
#define ERROR                          -1

#define ARGUMENT_FILE_SAVE_PATH        1
#define ARGUMENT_NUMBER_OF_BUY_ORDERS  2
#define ARGUMENT_NUMBER_OF_SELL_ORDERS 3

int main(int argc, char * argv[]) {


    // First argument is file save path.
    char * file_save_path = argv[ARGUMENT_FILE_SAVE_PATH];
    // Second argument is number of buy orders.
    int number_of_buy_orders = atoi(argv[ARGUMENT_NUMBER_OF_BUY_ORDERS]);
    // Third argument is number of sell orders.
    int number_of_sell_orders = atoi(argv[ARGUMENT_NUMBER_OF_SELL_ORDERS]);

    printf("The file save path is {%s}\n", file_save_path);
    printf("The number of buy orders is {%d}\n", number_of_buy_orders);
    printf("The number of sell orders is {%d}\n", number_of_sell_orders);

    

    /*
    char file_name[1024];

    //printf("timestamp %s\n", timestamp);
    //printf("book_type %d\n", book_type);
    //printf("number_of_entries %d\n", number_of_entries);
    //return SUCCESS;

    FILE * file_pointer;
    if (book_type == BOOK_TYPE_BUY_ORDERS) {
        char * file_directory = DIRECTORY_BUY_ORDERS;
        strcpy(file_name, file_directory);
    } else {
        char * file_directory = DIRECTORY_SELL_ORDERS;
        strcpy(file_name, file_directory);
    }
    strcpy(file_name, timestamp);
    printf("Filename is {%s}", file_name);
    file_pointer = fopen(file_name, "ab+");

    int current_entry = 0;
    while (current_entry < number_of_entries) {
        // TODO : Add error checking.
        float num;
        scanf("%f", & num);
        // TODO : BATCH SAVING, DON'T SAVE ONE NUMBER AT A TIME
        fwrite(& num, 1, sizeof(num), file_pointer);
        current_entry += 1;
    }

    /*
    float num;
    if (scanf("%f", & num) != ERROR) {
        //fprintf(fp, "%f", num);
        fwrite(& num, 1, sizeof(num), fp);
    }
    */

    //fclose(file_pointer);
    return SUCCESS;
}