'use strict';


const ENTITY_TYPE_BASE                   = 0;
const ENTITY_TYPE_TASK                   = 1;
const ENTITY_TYPE_WALL                   = 2;
const ENTITY_TYPE_ENTITY_GROUP           = 3;
const ENTITY_TYPE_OWNER                  = 4;
const ENTITY_TYPE_TEXT_REMINDER          = 5;
const ENTITY_TYPE_DYNAMIC_WORLD          = 6;
const ENTITY_TYPE_STATIC_WORLD           = 7;
const ENTITY_TYPE_DYNAMIC_WORLDS_MANAGER = 8;
const ENTITY_TYPE_STATIC_WORLDS_MANAGER  = 9;
const ENTITY_TYPE_PICTURE                = 10;
const ENTITY_TYPE_MONTH_VIEW_WALL        = 11;
const ENTITY_TYPE_VIDEO                  = 12;

const ENTITY_STATIC_WORLD_HOME     = 0;
const ENTITY_STATIC_WORLD_SETTINGS = 1;
const ENTITY_STATIC_WORLD_ADMIN    = 2;


const ENTITY_PROPERTY_START_TOKEN = '_p';
const ENTITY_DEFAULT_PROPERTY_TYPE        = ENTITY_PROPERTY_START_TOKEN + '0';
const ENTITY_DEFAULT_PROPERTY_CHILD_IDS   = ENTITY_PROPERTY_START_TOKEN + '1';
const ENTITY_DEFAULT_PROPERTY_PARENT_IDS  = ENTITY_PROPERTY_START_TOKEN + '2';
const ENTITY_DEFAULT_PROPERTY_RELATIVE_ID = ENTITY_PROPERTY_START_TOKEN + '3';

const ENTITY_PROPERTY_OWNER                  = ENTITY_PROPERTY_START_TOKEN + '4';
const ENTITY_PROPERTY_PASSWORD               = ENTITY_PROPERTY_START_TOKEN + '5';
const ENTITY_PROPERTY_USERNAME               = ENTITY_PROPERTY_START_TOKEN + '6';
const ENTITY_PROPERTY_EMAIL                  = ENTITY_PROPERTY_START_TOKEN + '7';
const ENTITY_PROPERTY_NAME                   = ENTITY_PROPERTY_START_TOKEN + '8';
const ENTITY_PROPERTY_POSITION               = ENTITY_PROPERTY_START_TOKEN + '9';
const ENTITY_PROPERTY_LOOK_AT                = ENTITY_PROPERTY_START_TOKEN + '10';
const ENTITY_PROPERTY_COMPLETED              = ENTITY_PROPERTY_START_TOKEN + '11';
const ENTITY_PROPERTY_PHONE_NUMBER           = ENTITY_PROPERTY_START_TOKEN + '12';
const ENTITY_PROPERTY_PHONE_CARRIER          = ENTITY_PROPERTY_START_TOKEN + '13';
const ENTITY_PROPERTY_CREATED_AT_DATE        = ENTITY_PROPERTY_START_TOKEN + '14';
const ENTITY_PROPERTY_IMAGE_DATA             = ENTITY_PROPERTY_START_TOKEN + '15';
const ENTITY_PROPERTY_IS_ROOT_ATTACHABLE     = ENTITY_PROPERTY_START_TOKEN + '16';
const ENTITY_PROPERTY_3D_ROWS                = ENTITY_PROPERTY_START_TOKEN + '17';
const ENTITY_PROPERTY_2D_ROWS                = ENTITY_PROPERTY_START_TOKEN + '18';
const ENTITY_PROPERTY_TAGS                   = ENTITY_PROPERTY_START_TOKEN + '19';
const ENTITY_PROPERTY_NOTE                   = ENTITY_PROPERTY_START_TOKEN + '20';
const ENTITY_PROPERTY_START_DATE_TIME        = ENTITY_PROPERTY_START_TOKEN + '21';
const ENTITY_PROPERTY_END_DATE_TIME          = ENTITY_PROPERTY_START_TOKEN + '22';
const ENTITY_PROPERTY_TIME_NEEDED            = ENTITY_PROPERTY_START_TOKEN + '23';
const ENTITY_PROPERTY_TIME_DURATION          = ENTITY_PROPERTY_START_TOKEN + '24';
const ENTITY_PROPERTY_OWNER_ACCOUNT_TYPE     = ENTITY_PROPERTY_START_TOKEN + '25';
const ENTITY_PROPERTY_GROUP_NAME             = ENTITY_PROPERTY_START_TOKEN + '26';
const ENTITY_PROPERTY_IMPORTANCE             = ENTITY_PROPERTY_START_TOKEN + '27';
const ENTITY_PROPERTY_WIDTH                  = ENTITY_PROPERTY_START_TOKEN + '28';
const ENTITY_PROPERTY_HEIGHT                 = ENTITY_PROPERTY_START_TOKEN + '29';
const ENTITY_PROPERTY_NORMAL                 = ENTITY_PROPERTY_START_TOKEN + '30';
const ENTITY_PROPERTY_MONTH_TYPE             = ENTITY_PROPERTY_START_TOKEN + '31';
const ENTITY_PROPERTY_YEAR_TYPE              = ENTITY_PROPERTY_START_TOKEN + '32';
const ENTITY_PROPERTY_MONTH_VIEW_TYPE        = ENTITY_PROPERTY_START_TOKEN + '33';






const ENTITY_PROPERTY_COMPLETED_VALUE_NO  = 'no';
const ENTITY_PROPERTY_COMPLETED_VALUE_YES = 'yes';




const MONTH_VIEW_TYPE_SIMPLE          = 'simple';
const MONTH_VIEW_TYPE_FULL            = 'full';



function get_entity_type_full_name(entity_type) {
    switch(entity_type) {
    case ENTITY_TYPE_BASE:
        return 'Entity';
    case ENTITY_TYPE_TASK:
        return 'Task';
    case ENTITY_TYPE_ENTITY_GROUP:
        return 'EntityGroup';
    case ENTITY_TYPE_TEXT_REMINDER:
        return 'TextReminder';
    }
}


function get_entity_property_full_name(entity_property) {
    switch(entity_property){
    case ENTITY_DEFAULT_PROPERTY_TYPE:
        return 'Entity Type';
    case ENTITY_PROPERTY_NAME:
        return 'Name';
    case ENTITY_PROPERTY_EMAIL:
        return 'Email';
    case ENTITY_PROPERTY_START_DATE_TIME:
        return 'State Date Time';
    case ENTITY_PROPERTY_END_DATE_TIME:
        return 'End Date Time';
    case ENTITY_PROPERTY_COMPLETED:
        return 'Completed';
    case ENTITY_PROPERTY_TAGS:
        return 'Tags';
    case ENTITY_PROPERTY_NOTE:
        return 'Notes';
    case ENTITY_PROPERTY_TIME_NEEDED:
        return 'Time Needed';
    case ENTITY_PROPERTY_TIME_DURATION:
        return 'Time Duration';
    }
}
