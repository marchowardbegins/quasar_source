'use strict';

function MonthInstance(month_identifier, year_identifier) {
    this.__init__(month_identifier, year_identifier);
}

MonthInstance.prototype = {
    __init__: function(month_identifier, year_identifier) {
        // Inherit.
        MonthIdentifier.call(this, month_identifier);
        YearIdentifier.call(this, year_identifier);

        this.day_instances = [];
    },

    /*     __   __       ___  ___  __   __
     |  | |__) |  \  /\   |  |__  |__) /__`
     \__/ |    |__/ /~~\  |  |___ |  \ .__/ */
    apply_delta: function(units, magnitude) {
        let previous_year_number = this.year_number;
        let previous_month_number = this.month_number;
        switch (units) {
        case TIME_DELTA_YEARS:
            this.year_number += magnitude;
            break;
        case TIME_DELTA_MONTHS:
            this.month_number += magnitude;
            while (this.month_number > 11) {
                this.month_number -= 11;
                this.year_number += 1;
            }
            while (this.month_number < 0) {
                this.month_number += 11;
                this.year_number -= 1;
            }
            break;
        }
        if (previous_month_number !== this.month_number || previous_year_number !== this.year_number) {
            this.day_instances.length = 0;
        }
    },

    /*__   ___ ___ ___  ___  __   __  
     / _` |__   |   |  |__  |__) /__` 
     \__> |___  |   |  |___ |  \ .__/ */
    get_all_day_instances: function() {
        if (this.day_instances.length === 0) {
            this.set_last_day_of_this_month();

            let current_week = 5;
            if (this.last_day_of_this_month <= 28) {
                current_week = 4;
            }

            let current_day_of_week = this.last_day_of_this_month_day_of_the_week;

            for (let d = this.last_day_of_this_month; d > 0; d--) {
                this.day_instances.push(new DayInstance(d, current_week, current_day_of_week, this));

                current_day_of_week -= 1;
                if (current_day_of_week < 0) {
                    current_day_of_week = 6;
                    current_week -= 1;
                }
            }
        }
        return this.day_instances;
    },

    get_full_string: function() {
        return '(' + (this.month_number + 1) + ') ' + get_month_string_from_number(this.month_number) + ' ' + this.year_number;
    }
};
