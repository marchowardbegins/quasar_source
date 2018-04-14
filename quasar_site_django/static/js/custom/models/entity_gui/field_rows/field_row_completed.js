'use strict';

function FieldRowCompleted(entity_editor) {
    this.__init__(entity_editor);
}

FieldRowCompleted.prototype = {

    __init__: function(entity_editor) {
        // Inherit.
        EntityEditorFieldRow.call(this, entity_editor);
        this.set_entity_property(ENTITY_PROPERTY_COMPLETED);

        this.completed = false;
    },

    _mark_completed_as: function(completed) {
        var refresh_needed = false;

        if (completed) {
            if (!this.completed) {
                this.completed = true;
                this.completed_check_mark.detach_from_parent();
                this.mark_as_completed_button.add_attachment(this.completed_check_mark);
                refresh_needed = true;
            }
        } else {
            if (this.completed) {
                this.completed = false;
                this.completed_check_mark.detach_from_parent();
                this.mark_as_not_completed_button.add_attachment(this.completed_check_mark);
                refresh_needed = true;
            }
        }

        if (refresh_needed) {
            this.entity_editor.base_wall.refresh_position_and_look_at();
        }
    },

    /*            ___  __    ___  ___  __      ___            __  ___    __        __
     | |\ | |__| |__  |__) |  |  |__  |  \    |__  |  | |\ | /  `  |  | /  \ |\ | /__`
     | | \| |  | |___ |  \ |  |  |___ |__/    |    \__/ | \| \__,  |  | \__/ | \| .__/ */
    create_input: function(field_value) {
        this.mark_as_not_completed_button = this.row.add_button([ONE_THIRD, TWO_THIRDS, false], 16, ENTITY_PROPERTY_COMPLETED_VALUE_NO, this._mark_completed_as.bind(this, false), COLOR_RED);
        this.mark_as_completed_button = this.row.add_button([TWO_THIRDS, 1, false], 16, ENTITY_PROPERTY_COMPLETED_VALUE_YES, this._mark_completed_as.bind(this, true), COLOR_GREEN);

        this.completed_check_mark = new FloatingIcon(this.entity_editor.world, ICON_CHECKMARK, 16);
        this.completed_check_mark.set_attachment_depth_offset(2);
        this.completed_check_mark.set_attachment_horizontal_offset(null, -HALF);

        if (is_defined(field_value)) {
            if (field_value === ENTITY_PROPERTY_COMPLETED_VALUE_YES) {
                this.completed = false;
                this._mark_completed_as(true);
            } else {
                this.completed = true;
                this._mark_completed_as(false);
            }
        } else {
            this.mark_as_not_completed_button.add_attachment(this.completed_check_mark);
        }
    },

    get_value: function() {
        if (this.completed) {
            return ENTITY_PROPERTY_COMPLETED_VALUE_YES;
        }
        return ENTITY_PROPERTY_COMPLETED_VALUE_NO;
    }
};