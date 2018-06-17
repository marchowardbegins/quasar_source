'use strict';

/*___      __   ___  __
   |  \ / |__) |__  /__`
   |   |  |    |___ .__/ */
const TIME_DELTA_YEARS  = 1;
const TIME_DELTA_DAYS   = 2;
const TIME_DELTA_MONTHS = 3;

const TIME_TYPE_YEAR_CURRENT  = 21;
const TIME_TYPE_YEAR_STATIC   = 22;
const TIME_TYPE_MONTH_CURRENT = 23;
const TIME_TYPE_MONTH_STATIC  = 24;
const TIME_TYPE_DAY_CURRENT   = 25;
const TIME_TYPE_DAY_STATIC    = 26;

/*     __       ___          __   __        __  ___           ___  __
 |\/| /  \ |\ |  |  |__|    /  ` /  \ |\ | /__`  |   /\  |\ |  |  /__`
 |  | \__/ | \|  |  |  |    \__, \__/ | \| .__/  |  /~~\ | \|  |  .__/ */
const MONTH_JANUARY   = 0;
const MONTH_FEBRUARY  = 1;
const MONTH_MARCH     = 2;
const MONTH_APRIL     = 3;
const MONTH_MAY       = 4;
const MONTH_JUNE      = 5;
const MONTH_JULY      = 6;
const MONTH_AUGUST    = 7;
const MONTH_SEPTEMBER = 8;
const MONTH_OCTOBER   = 9;
const MONTH_NOVEMBER  = 10;
const MONTH_DECEMBER  = 11;

const MONTH_JANUARY_STRING   = 'January';
const MONTH_FEBRUARY_STRING  = 'February';
const MONTH_MARCH_STRING     = 'March';
const MONTH_APRIL_STRING     = 'April';
const MONTH_MAY_STRING       = 'May';
const MONTH_JUNE_STRING      = 'June';
const MONTH_JULY_STRING      = 'July';
const MONTH_AUGUST_STRING    = 'August';
const MONTH_SEPTEMBER_STRING = 'September';
const MONTH_OCTOBER_STRING   = 'October';
const MONTH_NOVEMBER_STRING  = 'November';
const MONTH_DECEMBER_STRING  = 'December';

const MONTH_NAMES = [MONTH_JANUARY_STRING, MONTH_FEBRUARY_STRING, MONTH_MARCH_STRING, MONTH_APRIL_STRING, MONTH_MAY_STRING, MONTH_JUNE_STRING, MONTH_JULY_STRING, MONTH_AUGUST_STRING, MONTH_SEPTEMBER_STRING, MONTH_OCTOBER_STRING, MONTH_NOVEMBER_STRING, MONTH_DECEMBER_STRING];

/*__               __   __        __  ___           ___  __
 |  \  /\  \ /    /  ` /  \ |\ | /__`  |   /\  |\ |  |  /__`
 |__/ /~~\  |     \__, \__/ | \| .__/  |  /~~\ | \|  |  .__/ */
const DAY_MONDAY    = 0;
const DAY_TUESDAY   = 1;
const DAY_WEDNESDAY = 2;
const DAY_THURSDAY  = 3;
const DAY_FRIDAY    = 4;
const DAY_SATURDAY  = 5;
const DAY_SUNDAY    = 6;

const DAY_MONDAY_STRING    = 'Monday';
const DAY_TUESDAY_STRING   = 'Tuesday';
const DAY_WEDNESDAY_STRING = 'Wednesday';
const DAY_THURSDAY_STRING  = 'Thursday';
const DAY_FRIDAY_STRING    = 'Friday';
const DAY_SATURDAY_STRING  = 'Saturday';
const DAY_SUNDAY_STRING    = 'Sunday';

const DAY_NAMES = [DAY_MONDAY_STRING, DAY_TUESDAY_STRING, DAY_WEDNESDAY_STRING, DAY_THURSDAY_STRING, DAY_FRIDAY_STRING, DAY_SATURDAY_STRING, DAY_SUNDAY_STRING];

/*__        __   __                ___            __  ___    __        __
 / _` |    /  \ |__)  /\  |       |__  |  | |\ | /  `  |  | /  \ |\ | /__`
 \__> |___ \__/ |__) /~~\ |___    |    \__/ | \| \__,  |  | \__/ | \| .__/ */
function get_month_number_from_string(s) {
    return MONTH_NAMES.indexOf(s);
}

function get_day_number_from_string(s) {
    return DAY_NAMES.indexOf(s);
}

function get_month_string_from_number(n) {
    return MONTH_NAMES[n];
}

function get_day_string_from_number(n) {
    return DAY_NAMES[n];
}

function get_current_month_number() {
    let d = new Date();
    return d.getMonth();
}

function get_current_year_number() {
    let d = new Date();
    return d.getFullYear();
}

// Temporary.
function get_current_hour() {
    let d = new Date();
    return d.getHours();
}

// Temporary.
function get_current_minute() {
    let d = new Date();
    return d.getMinutes();
}

// From : https://stackoverflow.com/questions/13146418/find-all-the-days-in-a-month-with-date-object
/**
 * @param {int} month : The month number, 0 based
 * @param {int} year  :The year, not zero based, required to account for leap years
 * @return {Date[]} List with date objects for each day of the month
 */
function get_days_in_month(month, year) {
    let date = new Date(year, month, 1);
    let days = [];
    while (date.getMonth() === month) {
        days.push(new Date(date));
        date.setDate(date.getDate() + 1);
    }
    return days;
}

/*___          ___     __   __        __  ___           ___  __
   |  |  |\/| |__     /  ` /  \ |\ | /__`  |   /\  |\ |  |  /__`
   |  |  |  | |___    \__, \__/ | \| .__/  |  /~~\ | \|  |  .__/ */
// TODO : These need to get updated when client side hits midnight!
const CURRENT_MONTH = new MonthInstance(TIME_TYPE_MONTH_CURRENT);
const CURRENT_DAY   = new DayInstance(TIME_TYPE_DAY_CURRENT, CURRENT_MONTH);
