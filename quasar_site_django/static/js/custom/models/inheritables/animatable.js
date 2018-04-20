'use strict';

function Animatable() {

    // TODO : Eventually change the design so not every instance requires a tracking of delta.

    this.animation_duration = null;
    this.has_animation = false;
    this.requires_animation_update = false;

    this.animation_finished = false;

    this._elapsed_delta = 0;
    this.percentage_elapsed = 0;

    this._restart_animation = function() {
        this.animation_finished = false;
        this.requires_animation_update = true;
        this._elapsed_delta = 0;
        this.percentage_elapsed = 0;


        let start_position = this.get_parent_position();
        let start_offset   = this.get_position_offset();

        this.animation_start_position_x = start_position.x + start_offset[0];
        this.animation_start_position_y = start_position.y + start_offset[1];
        this.animation_start_position_z = start_position.z + start_offset[2];
        this.set_position(this.animation_start_position_x, this.animation_start_position_y, this.animation_start_position_z);
    };

    this.end_animation = function() {
        this.requires_animation_update = false;
    };

    this.update = function(delta) {
        //l('Performing an animation update!');

        this._elapsed_delta += delta;
        if (this._elapsed_delta >= this.animation_duration) {
            this.animation_finished = true;
            this.percentage_elapsed = 1.0;
            this.requires_animation_update = false;
        } else {
            this.percentage_elapsed = this._elapsed_delta / this.animation_duration;
        }

        let animation_offset = this.get_animation_total_offset();

        this.set_position(this.animation_start_position_x + animation_offset[0] * this.percentage_elapsed,
            this.animation_start_position_y + animation_offset[1] * this.percentage_elapsed,
            this.animation_start_position_z + animation_offset[2] * this.percentage_elapsed, true);

        /*
        l(this.animation_start_position_x);
        l(this.animation_start_position_y);
        l(this.animation_start_position_z);

        l(animation_offset[0]);
        l(animation_offset[1]);
        l(animation_offset[2]);

        l(this.percentage_elapsed);

        l('The position is now :');
        l(this.get_position());
        */
    };

    this.update_all_child_animations_recursively = function(delta) {
        let a;
        for (a = 0; a < this.attachments.length; a++) {
            if (this.attachments[a].has_animation && this.attachments[a].requires_animation_update) {
                this.attachments[a].update(delta);
            }
            this.attachments[a].update_all_child_animations_recursively(delta);
        }
    };

    this.set_animation_duration = function(d) {
        this.animation_duration = d;
    };

    this.set_animation_horizontal_offset = function(distance_offset, parent_width_percentage_offset) {
        if (!this.has_animation) {
            this.has_animation = true;
        }
        this.animation_horizontal_distance                = distance_offset;
        this.animation_horizontal_parent_width_percentage = parent_width_percentage_offset;
    };

    this.set_animation_vertical_offset = function(distance_offset, parent_height_percentage_offset) {
        if (!this.has_animation) {
            this.has_animation = true;
        }
        this.animation_vertical_distance                 = distance_offset;
        this.animation_vertical_parent_height_percentage = parent_height_percentage_offset;
    };

    this.set_animation_depth_offset = function(depth_offset) {
        if (!this.has_animation) {
            this.has_animation = true;
        }
        this.animation_normal_distance = depth_offset;
    };

    // WARNING : This is recursive. Change the design later.
    this.restart_all_animations = function() {
        if (this.has_animation) {
            this._restart_animation();
        }
        let a;
        for (a = 0; a < this.attachments.length; a++) {
            if (this.attachments[a].has_animation) {
                this.attachments[a]._restart_animation();
            }
            this.attachments[a].restart_all_animations();
        }
    };

    /*__   ___ ___ ___  ___  __   __
     / _` |__   |   |  |__  |__) /__`
     \__> |___  |   |  |___ |  \ .__/ */
    this.get_animation_total_offset = function(n) {
        let normal;
        if (is_defined(n)) {
            normal = n;
        } else {
            normal = this.get_normal();
        }
        let dx = 0;
        let dy = 0;
        let dz = 0;
        let d;
        if (is_defined(this.animation_horizontal_distance)) {
            d = this.get_horizontal_shift(this.animation_horizontal_distance);
            dx += d.x;
            dy += d.y;
            dz += d.z;
        }
        if (is_defined(this.animation_horizontal_parent_width_percentage)) {
            d = this.get_horizontal_shift(this.attachment_parent.width * this.animation_horizontal_parent_width_percentage);
            dx += d.x;
            dy += d.y;
            dz += d.z;
        }
        // TODO : WARNING : For now this only supports y-normals of 0.
        if (is_defined(this.animation_vertical_distance)) {
            dy += this.animation_vertical_distance;
        }
        if (is_defined(this.animation_vertical_parent_height_percentage)) {
            dy += this.animation_vertical_parent_height_percentage * this.attachment_parent.height;
        }
        if (is_defined(this.animation_normal_distance)) {
            dx += normal.x * this.offset_normal_distance;
            dy += normal.y * this.offset_normal_distance;
            dz += normal.z * this.offset_normal_distance;
        }
        return [dx, dy, dz];
    };

}