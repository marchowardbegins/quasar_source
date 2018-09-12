'use strict';

function MonthView(world, entity_to_load_from) {
    this.__init__(world, entity_to_load_from);
}

// TODO : Create the various month types.

MonthView.prototype = {

    __init__: function(world, entity_to_load_from) {
        let created_new = false;
        if (is_defined(entity_to_load_from)) {
            this.load_from_entity(world, entity_to_load_from);
        } else {
            created_new = true;
            this.create_new(world);
        }

        this.month_instance = new MonthInstance(this.month_view_entity.get_value(ENTITY_PROPERTY_MONTH_TYPE), this.month_view_entity.get_value(ENTITY_PROPERTY_YEAR_TYPE));

        if (created_new) {
            this.update_title();
        }

        this.simple_day_views = [];

        this.add_base_wall_functionality();

        this.base_wall.only_moveable = true;
        this.base_wall.world.root_attachables.push(this.base_wall);
        this.base_wall.refresh_position_and_look_at();

        // Handles Entity Events.
        ViewableEntities.call(this);

        // Subscribe to entity notification events.
        EntityChangesSubscriber.call(this, world, false, true);
        this.add_to_subscribers_list();
        // If this MonthView was created instead of loaded make sure to add all needed linked entities.
        if (!is_defined(entity_to_load_from)) {
            this.link_all_from_entity_events();
        }
    },

    ////////
    update_title: function() {
        this.title.update_text(this.month_instance.get_full_string());
    },

    /*__   ___ ___ ___         __   __
     /__` |__   |   |  | |\ | / _` /__`    |  |  /\  |    |
     .__/ |___  |   |  | | \| \__> .__/    |/\| /~~\ |___ |___ */
    delete_month_view_wall: function() {
        MANAGER_ENTITY.delete_entity_by_id(this.base_wall.get_self_entity().get_relative_id());
        this.base_wall.fully_remove_self_and_all_sub_attachments();
    },

    month_type_selected: function(month_type) {
        this.month_instance.update_month_identifier(month_type);
        this.update_title();
        this.month_view_entity.set_property(ENTITY_PROPERTY_MONTH_TYPE, this.month_instance.get_month_type_for_entity());
        this.month_type_button.update_text(this.month_instance.get_month_type());
        this.month_type_selector_wall.force_hide_self_and_all_child_attachments_recursively();
    },

    year_type_selected: function(year_type) {
        this.month_instance.update_year_identifier(year_type);
        this.update_title();
        this.month_view_entity.set_property(ENTITY_PROPERTY_YEAR_TYPE, this.month_instance.get_year_type_for_entity());
        this.year_type_button.update_text(this.month_instance.get_year_type());
        this.year_type_selector_wall.force_hide_self_and_all_child_attachments_recursively();
    },

    create_month_type_selector: function() {
        this.month_type_selector_wall = this.month_type_button.add_floating_wall_attachment(400, 400, null, null, 10, false);
        this.month_type_selector_wall.add_close_button();
        this.month_type_selector_wall.set_auto_adjust_height(true);
        this.month_type_selector_wall.manual_visibility = true;

        this.month_type_selector_wall.add_row().add_button([0, 1, false], 16, 'Current Month', this.month_type_selected.bind(this, TIME_TYPE_MONTH_CURRENT), QE.COLOR_YELLOW);
        this.month_type_selector_wall.add_row().add_button([0, 1, false], 16, MONTH_JANUARY_STRING, this.month_type_selected.bind(this, MONTH_JANUARY));
        this.month_type_selector_wall.add_row().add_button([0, 1, false], 16, MONTH_FEBRUARY_STRING, this.month_type_selected.bind(this, MONTH_FEBRUARY));
        this.month_type_selector_wall.add_row().add_button([0, 1, false], 16, MONTH_MARCH_STRING, this.month_type_selected.bind(this, MONTH_MARCH));
        this.month_type_selector_wall.add_row().add_button([0, 1, false], 16, MONTH_APRIL_STRING, this.month_type_selected.bind(this, MONTH_APRIL));
        this.month_type_selector_wall.add_row().add_button([0, 1, false], 16, MONTH_MAY_STRING, this.month_type_selected.bind(this, MONTH_MAY));
        this.month_type_selector_wall.add_row().add_button([0, 1, false], 16, MONTH_JUNE_STRING, this.month_type_selected.bind(this, MONTH_JUNE));
        this.month_type_selector_wall.add_row().add_button([0, 1, false], 16, MONTH_JULY_STRING, this.month_type_selected.bind(this, MONTH_JULY));
        this.month_type_selector_wall.add_row().add_button([0, 1, false], 16, MONTH_AUGUST_STRING, this.month_type_selected.bind(this, MONTH_AUGUST));
        this.month_type_selector_wall.add_row().add_button([0, 1, false], 16, MONTH_SEPTEMBER_STRING, this.month_type_selected.bind(this, MONTH_SEPTEMBER));
        this.month_type_selector_wall.add_row().add_button([0, 1, false], 16, MONTH_OCTOBER_STRING, this.month_type_selected.bind(this, MONTH_OCTOBER));
        this.month_type_selector_wall.add_row().add_button([0, 1, false], 16, MONTH_NOVEMBER_STRING, this.month_type_selected.bind(this, MONTH_NOVEMBER));
        this.month_type_selector_wall.add_row().add_button([0, 1, false], 16, MONTH_DECEMBER_STRING, this.month_type_selected.bind(this, MONTH_DECEMBER));

        this.month_type_selector_wall.force_hide_self_and_all_child_attachments_recursively();
    },

    create_year_type_selector: function() {
        this.year_type_selector_wall = this.year_type_button.add_floating_wall_attachment(400, 400, null, null, 10, false);
        this.year_type_selector_wall.add_close_button();
        this.year_type_selector_wall.set_auto_adjust_height(true);
        this.year_type_selector_wall.manual_visibility = true;

        this.year_type_selector_wall.add_row().add_button([0, 1, false], 16, 'Current Year', this.year_type_selected.bind(this, TIME_TYPE_YEAR_CURRENT), QE.COLOR_YELLOW);

        let row = this.year_type_selector_wall.add_row();
        row.add_text_2D([0, ONE_THIRD, false], 16, 'Type Year :');
        this.year_input = row.add_input_2D([ONE_THIRD, 1, false], 16, '');

        row = this.year_type_selector_wall.add_row();
        row.add_button([0, 1, false], 16, 'Set To Static Year Typed', this.year_type_selected.bind(this, this.year_input.get_text()));

        this.year_type_selector_wall.force_hide_self_and_all_child_attachments_recursively();
    },

    show_month_type_selector: function() {
        this.month_type_selector_wall.force_display_self_and_all_child_attachments_recursively();
    },

    show_year_type_selector: function() {
        this.year_type_selector_wall.force_display_self_and_all_child_attachments_recursively();
    },

    create_settings_wall: function() {
        this.settings_wall = this.base_wall.add_floating_wall_attachment(800, 400, null, [25, HALF], 10, false);
        this.settings_wall.add_close_button();
        this.settings_wall.set_auto_adjust_height(true);
        this.settings_wall.manual_visibility = true;

        let settings_row = this.settings_wall.add_row();
        settings_row.add_text_2D([0, ONE_THIRD, false], 16, 'Month Type :');
        this.month_type_button = settings_row.add_button([ONE_THIRD, 1, false], 16, this.month_instance.get_month_type(), this.show_month_type_selector.bind(this));

        settings_row = this.settings_wall.add_row();
        settings_row.add_text_2D([0, ONE_THIRD, false], 16, 'Year Type :');
        this.year_type_button = settings_row.add_button([ONE_THIRD, 1, false], 16, this.month_instance.get_year_type(), this.show_year_type_selector.bind(this));

        settings_row = this.settings_wall.add_row();
        settings_row.add_button([0, 1, false], 16, 'Delete Month View Wall', this.delete_month_view_wall.bind(this), QE.COLOR_RED);

        this.create_month_type_selector();
        this.create_year_type_selector();

        this.settings_wall.force_hide_self_and_all_child_attachments_recursively();
    },

    show_settings_wall: function() {
        this.settings_wall.force_display_self_and_all_child_attachments_recursively();
        this.month_type_selector_wall.force_hide_self_and_all_child_attachments_recursively();
        this.year_type_selector_wall.force_hide_self_and_all_child_attachments_recursively();
    },

    /*        ___                 __   __   ___      ___         __                __           __        __          __
     | |\ | |  |  |  /\  |       /  ` |__) |__   /\   |  | |\ | / _`     /\  |\ | |  \    |    /  \  /\  |  \ | |\ | / _`
     | | \| |  |  | /~~\ |___    \__, |  \ |___ /~~\  |  | | \| \__>    /~~\ | \| |__/    |___ \__/ /~~\ |__/ | | \| \__> */
    add_base_wall_functionality: function() {
        this.create_settings_wall();

        // Create the settings button.
        let row = this.base_wall.get_row_with_index(-1);
        let icon_width = 16 / this.base_wall.width;

        let settings_button = row.add_icon_button([1 - icon_width, 1, false], ASSET_ICON_GEARS, this.show_settings_wall.bind(this));

        // Month View details.
        row = this.base_wall.add_row();
        row.add_text_2D([0, 1 / 7, CENTER_ABSOLUTE], 32, DAY_MONDAY_STRING);
        row.add_text_2D([1 / 7, 2 / 7, CENTER_ABSOLUTE], 32, DAY_TUESDAY_STRING);
        row.add_text_2D([2 / 7, 3 / 7, CENTER_ABSOLUTE], 32, DAY_WEDNESDAY_STRING);
        row.add_text_2D([3 / 7, 4 / 7, CENTER_ABSOLUTE], 32, DAY_THURSDAY_STRING);
        row.add_text_2D([4 / 7, 5 / 7, CENTER_ABSOLUTE], 32, DAY_FRIDAY_STRING);
        row.add_text_2D([5 / 7, 6 / 7, CENTER_ABSOLUTE], 32, DAY_SATURDAY_STRING);
        row.add_text_2D([6 / 7, 1, CENTER_ABSOLUTE], 32, DAY_SUNDAY_STRING);

        // Add the day views here!
        let all_days = this.month_instance.get_all_day_instances();
        for (let d = 0; d < all_days.length; d++) {
            this.simple_day_views.push(new DayViewSimple(all_days[d], this.base_wall));
        }
        //this.week_one = this.base_wall.add_row(null, );
    },

    create_new: function(world) {
        let data = get_player_blink_spot(1000);
        this.base_wall = new FloatingWall(1600, 1000, data[0], data[1], world, true, COLOR_FLOATING_WALL_SUCCESS);
        this.base_wall.set_to_saveable(world.entity);

        this.month_view_entity = new Entity();
        this.month_view_entity.set_property(ENTITY_DEFAULT_PROPERTY_TYPE, ENTITY_TYPE_MONTH_VIEW_WALL);
        this.month_view_entity.set_property(ENTITY_PROPERTY_MONTH_TYPE, TIME_TYPE_MONTH_CURRENT);
        this.month_view_entity.set_property(ENTITY_PROPERTY_YEAR_TYPE, TIME_TYPE_YEAR_CURRENT);
        this.month_view_entity.add_parent(this.base_wall.get_self_entity());

        // Add the title.
        this.title = this.base_wall.add_row(-1).add_text_3D([0, null, false], 32, '');
    },

    load_from_entity: function(world, entity) {
        this.month_view_entity = entity;

        // Load the base wall.
        this.base_wall = new FloatingWall(1600, 1000, null, null, world, true, COLOR_FLOATING_WALL_SUCCESS);
        this.base_wall.load_from_entity_data(this.month_view_entity.get_parent());

        this.title = this.base_wall.get_row_with_index(-1).elements[0];
    }

};
