'use strict';

// Each world (that needs it) will contain a single instance of DateSelector to re-use.
function DateSelector(world, date_selected_callback) {
    this.__init__(world, date_selected_callback);
}

DateSelector.prototype = {

    hide: function() {
        this.wall_date_selector.detach_from_parent();
        this.wall_date_selector.force_hide_self_and_all_child_attachments_recursively();
    },

    __init__: function(world, date_selected_callback) {
        this.date_selected = date_selected_callback;

        this.wall_date_selector = new FloatingWall(600, 250, null, null, world, false, COLOR_BLACK);
        this.wall_date_selector.add_full_row_3D(-1, 'Date Selector', TYPE_TITLE, COLOR_YELLOW);
        this.wall_date_selector.add_close_button();
        this.wall_date_selector.set_attachment_depth_offset(10);
        this.wall_date_selector.manual_visibility = true;

        // Time Logic.
        this.month_instance = new MonthInstance(get_current_month_number());
        //this.all_days = this.current_month.get_all_day_instances();

        // Year.
        var row_year = this.wall_date_selector.add_row(null);
        this.button_year_decrease = row_year.add_2D_element([0, ONE_FOURTH], ICON_LEFT, TYPE_ICON);
        this.button_year_decrease.engable = false;
        this.button_year_decrease.set_engage_function(this.button_year_decrease_pressed.bind(this));
        world.interactive_objects.push(this.button_year_decrease);

        this.year = row_year.add_2D_element([ONE_FOURTH, THREE_FOURTHS], this.month_instance.get_year(), TYPE_CONSTANT);

        this.button_year_increase = row_year.add_2D_element([THREE_FOURTHS, 1], ICON_RIGHT, TYPE_ICON);
        this.button_year_increase.engable = false;
        this.button_year_increase.set_engage_function(this.button_year_increase_pressed.bind(this));
        world.interactive_objects.push(this.button_year_increase);

        // Month.
        var row_month = this.wall_date_selector.add_row(null);
        this.button_month_decrease =  row_month.add_2D_element([0, ONE_FOURTH], ICON_LEFT, TYPE_ICON);
        this.button_month_decrease.engable = false;
        this.button_month_decrease.set_engage_function(this.button_month_decrease_pressed.bind(this));
        world.interactive_objects.push(this.button_month_decrease);

        this.month = row_month.add_2D_element([ONE_FOURTH, THREE_FOURTHS], this.month_instance.get_month_string(), TYPE_CONSTANT);

        this.button_month_increase = row_month.add_2D_element([THREE_FOURTHS, 1], ICON_RIGHT, TYPE_ICON);
        this.button_month_increase.engable = false;
        this.button_month_increase.set_engage_function(this.button_month_increase_pressed.bind(this));
        world.interactive_objects.push(this.button_month_increase);

        // Day labels.
        var row_labels = this.wall_date_selector.add_row(null);
        this.day_label_monday    = row_labels.add_2D_element([0, 1 / 7]    , 'Monday'   , TYPE_CONSTANT);
        this.day_label_tuesday   = row_labels.add_2D_element([1 / 7, 2 / 7], 'Tuesday'  , TYPE_CONSTANT);
        this.day_label_wednesday = row_labels.add_2D_element([2 / 7, 3 / 7], 'Wednesday', TYPE_CONSTANT);
        this.day_label_thursday  = row_labels.add_2D_element([3 / 7, 4 / 7], 'Thursday' , TYPE_CONSTANT);
        this.day_label_friday    = row_labels.add_2D_element([4 / 7, 5 / 7], 'Friday'   , TYPE_CONSTANT);
        this.day_label_saturday  = row_labels.add_2D_element([5 / 7, 6 / 7], 'Saturday' , TYPE_CONSTANT);
        this.day_label_sunday    = row_labels.add_2D_element([6 / 7, 1]    , 'Sunday'   , TYPE_CONSTANT);

        // Add a row for spacing.
        this.spacing_row = this.wall_date_selector.add_row(null);

        // The rows that the date buttons will go into.
        this.wall_date_selector.add_row(null);
        this.wall_date_selector.add_row(null);
        this.wall_date_selector.add_row(null);
        this.wall_date_selector.add_row(null);
        this.wall_date_selector.add_row(null);

        this.wall_date_selector.add_row(null).add_2D_button([0, 1], 'set to no value', COLOR_RED, this.date_selected.bind(this, NO_DATE_SELECTED));

        this.wall_date_selector.hide_self_and_all_child_attachments_recursively();
    },

    refresh_dates: function() {
        if (is_defined(this.all_day_buttons)) {
            if (this.all_day_buttons.length > 0) {
                this._delete_all_day_buttons();
            }
        }
        this._create_all_day_buttons();
    },

    _delete_all_day_buttons: function() {
        for (var d = 0; d < this.all_day_buttons.length; d++) {
            this.all_day_buttons[d].detach_from_parent();
            this.all_day_buttons[d].remove_from_root_attachmentables_if_needed();
            this.all_day_buttons[d].full_remove();
        }
        this.all_day_buttons.length = 0;
    },

    _create_all_day_buttons: function() {
        this.all_days = this.month_instance.get_all_day_instances();

        this.all_day_buttons = [];

        var width_position = (this.wall_date_selector.width) / 7;
        var height_position = (this.wall_date_selector.height) / 6;

        var width = (this.wall_date_selector.width - 100) / 7;
        var height = (this.wall_date_selector.height - 100) / 6;

        for (var d = 0; d < this.all_days.length; d++) {
            var day_button = new Floating2DText(width, this.all_days[d].day_number, TYPE_BUTTON, this.wall_date_selector.world);
            height = day_button.height;
            day_button.set_attachment_depth_offset(5);
            day_button.set_attachment_horizontal_offset(width_position * this.all_days[d].day_of_the_week + width / 2, -HALF);
            day_button.set_attachment_vertical_offset(-(height_position * this.all_days[d].week_number - height / 4), HALF);

            day_button.set_engage_function(this.date_selected.bind(this, this.all_days[d]));
        }

        /*
        var row_index = this.spacing_row.row_number;

        for (var d = 0; d < this.all_days.length; d++) {

            //l(this.all_days[d]);

            var row = this.all_days[d].get_week_relative_to_current_month();
            var num = this.all_days[d].get_day_number_relative_to_current_week();
            var day_cell = null;

            var row_offset = 0;
            var start_position;
            var end_position;

            if (num === 0) {
                row_offset = -1;
                start_position = 6 / 7;
                end_position = 1;
            } else {
                start_position = (num - 1) / 7;
                end_position = num / 7;
            }

            day_cell = this.wall_date_selector.get_row_with_index(row_index + row + row_offset).add_2D_button([start_position, end_position], this.all_days[d].get_day_number(), this.current_month.get_day_color_by_index(d), this.date_selected.bind(this, this.all_days[d]));
            this.all_day_buttons.push(day_cell);
        }
        */

        this.wall_date_selector.refresh_position_and_look_at();
    },

    // Year.
    button_year_decrease_pressed: function() {
        this.month_instance.apply_delta(TIME_DELTA_YEARS, -1);
        this.year.update_text(this.month_instance.get_year());

        // TODO : Eventually implement cache to improve performance!
        this._delete_all_day_buttons();
        this._create_all_day_buttons();
    },

    button_year_increase_pressed: function() {
        this.month_instance.apply_delta(TIME_DELTA_YEARS, 1);
        this.year.update_text(this.date.get_year_as_string());

        // TODO : Eventually implement cache to improve performance!
        this._delete_all_day_buttons();
        this._create_all_day_buttons();
    },

    // Month.
    button_month_decrease_pressed: function() {
        this.month_instance.apply_delta(TIME_DELTA_MONTHS, -1);
        this.month.update_text(this.date.get_month_string());
        this.year.update_text(this.date.get_year());

        // TODO : Eventually implement cache to improve performance!
        this._delete_all_day_buttons();
        this._create_all_day_buttons();
    },

    button_month_increase_pressed: function() {
        this.month_instance.apply_delta(TIME_DELTA_MONTHS, 1);
        this.month.update_text(this.month_instance.get_month_string());
        this.year.update_text(this.month_instance.get_year());

        // TODO : Eventually implement cache to improve performance!
        this._delete_all_day_buttons();
        this._create_all_day_buttons();
    }
};
