'use strict';

function Attachmentable(world) {

    this.object3D = new THREE.Object3D();
    this.world    = world;
    this.world.add_to_scene(this.object3D);

    this.only_moveable = null;

    this.immune_to_attachment_deltas = false;

    // For optimization.
    this._position_offset = new THREE.Vector3(0, 0, 0);
    this._look_at_position = new THREE.Vector3(0, 0, 0);

    // All attachments will inherit Attachmentable.
    this.attachments = [];

    // The current object that has this instance as an attachment.
    this.attachment_parent = null;
    // The parent of this entire attachmentable chain.
    this.root_parent = null;
    // A name given to find this attachment later.
    this.relative_name = null;

    // Utility tags used for finding certain objects with more ease.
    this.dev_tags = [];

    this.manual_positioning = false;
    this.set_to_manual_positioning = function() {
        this.manual_positioning = true;
        this.object3D.matrixAutoUpdate = false;
    };

    this.add_tag = function(tag) {
        this.dev_tags.push(tag);
    };

    this.remove_tag = function(tag) {
        let remove_index = -1;
        let t;
        for (t = 0; t < this.dev_tags.length; t++) {
            if (this.dev_tags[t] === tag) {
                remove_index = t;
                break;
            }
        }
        this.dev_tags.splice(remove_index, 1);
    };

    this.has_tag = function(tag) {
        let t;
        for (t = 0; t < this.dev_tags.length; t++) {
            if (this.dev_tags[t] === tag) {
                return true;
            }
        }
        return false;
    };

    this.add_floating_wall_attachment = function(width, height, horizontal_offset, vertical_offset, depth_offset, scalable) {
        let floating_wall;
        if (is_defined(scalable)) {
            // OLD : floating_wall = new FloatingWall(width, height, position, this.get_normal(), this.world, scalable);
            floating_wall = new FloatingWall(width, height, null, null, this.world, scalable);
        } else {
            floating_wall = new FloatingWall(width, height, null, null, this.world, false);
        }

        this.add_attachment(floating_wall);

        if (is_defined(horizontal_offset)) {
            floating_wall.set_attachment_horizontal_offset(horizontal_offset[0], horizontal_offset[1]);
        }
        if (is_defined(vertical_offset)) {
            floating_wall.set_attachment_vertical_offset(vertical_offset[0], vertical_offset[1]);
        }
        if (is_defined(depth_offset)) {
            floating_wall.set_attachment_depth_offset(depth_offset);
        }
        return floating_wall;
    };

    this.add_floating_element = function(horizontal_offset, vertical_offset, depth_offset, floating_element) {
        this.add_attachment(floating_element);
        if (is_defined(horizontal_offset)) {
            floating_element.set_attachment_horizontal_offset(horizontal_offset[0], horizontal_offset[1]);
        }
        if (is_defined(vertical_offset)) {
            floating_element.set_attachment_vertical_offset(vertical_offset[0], vertical_offset[1]);
        }
        if (is_defined(depth_offset)) {
            floating_element.set_attachment_depth_offset(depth_offset);
        }
        return floating_element;
    };

    this.refresh_position_and_look_at = function() {
        this._refresh_look_at();

        if (this.manual_positioning) {
            this.object3D.updateMatrix();
            this.object3D.matrixWorldNeedsUpdate = true;
        }

        this.update_all_child_attachments();

        if (is_defined(this.post_position_update)) {
            this.post_position_update();
        }
    };

    // WARNING : This is recursive. Change the design later.
    this.update_all_child_attachments = function() {
        let parent_position = this.get_position();

        let a;
        for (a = 0; a < this.attachments.length; a++) {
            this.attachments[a].set_position(parent_position.x, parent_position.y, parent_position.z, false);
            this.attachments[a]._refresh_look_at();

            if (this.attachments[a].manual_positioning) {
                this.attachments[a].object3D.updateMatrix();
                this.attachments[a].object3D.matrixWorldNeedsUpdate = true;
            }

            if (this.attachments.length > 0) {
                this.attachments[a].update_all_child_attachments();
            }
        }
    };

    /*    ___ ___       __               __
      /\   |   |   /\  /  ` |__| | |\ | / _`
     /~~\  |   |  /~~\ \__, |  | | | \| \__> */
    this.is_attached = function() {
        return !(this.attachment_parent === null);
    };

    this.detach_from_parent = function() {
        if (is_defined(this.attachment_parent)) {
            let remove_index = -1;

            let a;
            for (a = 0; a < this.attachment_parent.attachments.length; a++) {
                if (this.attachment_parent.attachments[a] === this) {
                    remove_index = a;
                    break;
                }
            }

            if (remove_index !== NOT_FOUND) {
                this.attachment_parent.attachments.splice(remove_index, 1);
                this.attachment_parent = null;
            }
        }
    };

    this.attach_to = function(attachment_parent) {
        attachment_parent.add_attachment(this);
    };

    this.add_attachment = function(attachment) {
        this.attachments.push(attachment);
        if (this.is_root()) {
            attachment.root_parent = this;
        } else {
            attachment.root_parent = this.root_parent;
        }
        attachment.attachment_parent = this;

        if (this.manual_positioning) {
            attachment.set_to_manual_positioning();
            let a;
            for (a = 0; a < attachment.attachments.length; a++) {
                attachment.attachments[a].set_to_manual_positioning();
            }
        }
    };

    /*                    ___          __   __       ___  ___  __
     \  /  /\  |    |  | |__     |  | |__) |  \  /\   |  |__  /__`
      \/  /~~\ |___ \__/ |___    \__/ |    |__/ /~~\  |  |___ .__/ */
    this.set_new_height = function(height) {
        this.height = height;
        this.dimensions_changed();
    };

    this.update_height = function(percentage_change) {
        this.height *= percentage_change;
        this.update_dimensions();
    };

    this.update_width = function(percentage_change) {
        this.width *= percentage_change;
        this.update_dimensions();
    };

    this.update_dimensions = function() {
        if (is_defined(this.post_update_dimensions)) {
            this.post_update_dimensions();
        }

        if (this.scalable) {
            this.dimensions_changed();
        }
        let a;
        for (a = 0; a < this.attachments.length; a++) {
            if (this.attachments[a].scalable) {
                this.attachments[a].dimensions_changed();
                this.attachments[a].update_dimensions();
            }
        }
    };

    this.dimensions_changed = function() {
        this.delete_mesh();
        this.create_base_mesh();
    };

    /*__   ___ ___ ___  ___  __   __
     /__` |__   |   |  |__  |__) /__`
     .__/ |___  |   |  |___ |  \ .__/ */
    this.set_attachment_name = function(n) {
        this.relative_name = n;
    };

    this.look_at_origin = function(refresh) {
        // OLD : this.object3D.lookAt(-this.object3D.position.x, 0, -this.object3D.position.z);
        this.object3D.lookAt(0, this.object3D.position.y, 0);
        if (this.is_root()) {
            if (!is_defined(this.normal)) {
                // OLD : var normal = new THREE.Vector3(-this.object3D.position.x, 0, -this.object3D.position.z);
                let normal = new THREE.Vector3(-this.object3D.position.x, 0, -this.object3D.position.z);
                normal.normalize();
                this.normal = normal;
            }
        }
        if (refresh) {
            this._refresh_look_at();
        }
    };

    this.set_position_for_singleton = function(x, y, z) {
        this.set_position_offset();
        this.object3D.position.set(x + this._position_offset.x, y + this._position_offset.y, z + this._position_offset.z);
        this._refresh_look_at();
    };

    this.set_position = function(x, y, z, refresh) {
        if (this.is_root()) {
            this.object3D.position.set(x, y, z);
        } else {
            this.set_position_offset();
            this.object3D.position.set(x + this._position_offset.x, y + this._position_offset.y, z + this._position_offset.z);
        }
        if (refresh) {
            this._refresh_look_at();
            this.update_all_child_attachments();
        }
    };

    // This function should only be called on a root element.
    this.set_normal = function(x, y, z, refresh) {
        if (!is_defined(this.normal)) {
            this.normal = new THREE.Vector3(x, y, z);
        }
        //this.normal = new THREE.Vector3(x, y, z);
        this.normal.set(x, y, z);
        this.normal.normalize();

        if (!is_defined(this.left_right)) {
            this.left_right = new THREE.Vector3(-this.normal.x, 0, -this.normal.z);
        }
        this.left_right.set(-this.normal.x, 0, -this.normal.z);
        this.left_right.cross(UP_VECTOR);
        this.left_right.normalize();
        if (refresh) {
            this._refresh_look_at();
            this.update_all_child_attachments();
        }
    };

    this.set_attachment_horizontal_distance_offset = function(distance_offset) {
        this.offset_horizontal_distance = distance_offset;
    };

    this.set_attachment_horizontal_offset = function(distance_offset, parent_width_percentage_offset) {
        // No need for is_defined checks as the values will be checked before being used.
        this.offset_horizontal_distance = distance_offset;
        this.offset_horizontal_parent_width_percentage = parent_width_percentage_offset;
    };

    this.apply_delta_to_horizontal_offset = function(distance_offset, parent_width_percentage_offset) {
        if (!this.immune_to_attachment_deltas) {
            if (is_defined(this.offset_horizontal_distance)) {
                this.offset_horizontal_distance += distance_offset;
            } else {
                this.offset_horizontal_distance = distance_offset;
            }
            if (is_defined(parent_width_percentage_offset)) {
                this.offset_horizontal_parent_width_percentage += parent_width_percentage_offset;
            } else {
                this.offset_horizontal_parent_width_percentage = parent_width_percentage_offset;
            }
        }
    };

    this.set_attachment_vertical_offset = function(distance_offset, parent_height_percentage_offset) {
        // No need for is_defined checks as the values will be checked before being used.
        this.offset_vertical_distance = distance_offset;
        this.offset_vertical_parent_height_percentage = parent_height_percentage_offset;
    };

    this.apply_delta_to_vertical_offset = function(distance_offset, parent_height_percentage_offset) {
        if (!this.immune_to_attachment_deltas) {
            if (is_defined(this.offset_vertical_distance)) {
                this.offset_vertical_distance += distance_offset;
            } else {
                this.offset_vertical_distance = distance_offset;
            }
            if (is_defined(this.offset_vertical_parent_height_percentage)) {
                this.offset_vertical_parent_height_percentage += parent_height_percentage_offset;
            } else {
                this.offset_vertical_parent_height_percentage = parent_height_percentage_offset;
            }
        }
    };

    this.set_attachment_depth_offset = function(depth_offset) {
        this.offset_normal_distance = depth_offset;
    };

    this.apply_delta_to_depth_offset = function(depth_offset) {
        if (!this.immune_to_attachment_deltas) {
            if (is_defined(this.offset_normal_distance)) {
                this.offset_normal_distance += depth_offset;
            } else {
                this.offset_normal_distance = depth_offset;
            }
        }
    };

    /*__   ___ ___ ___  ___  __   __
     / _` |__   |   |  |__  |__) /__`
     \__> |___  |   |  |___ |  \ .__/ */
    this.has_attachment = function(attachment) {
        for (let a = 0; a < this.attachments.length; a++) {
            if (this.attachments[a] === attachment) {
                return true;
            }
        }
        return false;
    };

    this.set_position_offset = function(n) {
        let normal;
        if (is_defined(n)) {
            normal = n;
        } else {
            normal = this.get_normal();
        }
        let dx = 0;
        let dy = 0;
        let dz = 0;

        let magnitude = 0;
        if (is_defined(this.offset_horizontal_distance)) {
            magnitude += this.offset_horizontal_distance;
        }
        if (is_defined(this.offset_horizontal_parent_width_percentage)) {
            magnitude += this.attachment_parent.width * this.offset_horizontal_parent_width_percentage;
        }
        let left_right = this.get_left_right();
        dx += left_right.x * magnitude;
        dy += left_right.y * magnitude;
        dz += left_right.z * magnitude;

        // TODO : WARNING : For now this only supports y-normals of 0.
        if (is_defined(this.offset_vertical_distance)) {
            dy += this.offset_vertical_distance;
        }
        if (is_defined(this.offset_vertical_parent_height_percentage)) {
            dy += this.offset_vertical_parent_height_percentage * this.attachment_parent.height;
        }
        if (is_defined(this.offset_normal_distance)) {
            dx += normal.x * this.offset_normal_distance;
            dy += normal.y * this.offset_normal_distance;
            dz += normal.z * this.offset_normal_distance;
        }
        this._position_offset.set(dx, dy, dz);
    };

    this.get_horizontal_distance_to_center = function(x, z) {
        return sqrt(squared(x - this.object3D.position.x) + squared(z - this.object3D.position.z));
    };

    this.get_parent_position = function() {
        return this.attachment_parent.object3D.position;
    };

    this.get_position = function() {
        return this.object3D.position;
    };

    // WARNING : This is recursive. Use different design later.
    this.get_normal = function() {
        if (is_defined(this.normal)) {
            return this.normal;
        } else {
            return this.attachment_parent.get_normal();
        }
    };

    // WARNING : This is recursive. Use different design later.
    this.get_left_right = function() {
        if (is_defined(this.left_right)) {
            return this.left_right;
        } else {
            return this.attachment_parent.get_left_right();
        }
    };

    this.is_root = function() {
        return !is_defined(this.attachment_parent);
    };

    this._get_all_attachments_recursively = function() {
        let attachments = [];
        let a;
        for (a = 0; a < this.attachments.length; a++) {
            attachments.push(this.attachments[a]);
            let attachments_of_this_attachment = this.attachments[a]._get_all_attachments_recursively();
            let aa;
            for (aa = 0; aa < attachments_of_this_attachment.length; aa++) {
                attachments.push(attachments_of_this_attachment[aa]);
            }
        }
        return attachments;
    };

    /*__   ___  __   __        __   __   ___     __        ___                 __
     |__) |__  /__` /  \ |  | |__) /  ` |__     /  ` |    |__   /\  |\ | |  | |__)
     |  \ |___ .__/ \__/ \__/ |  \ \__, |___    \__, |___ |___ /~~\ | \| \__/ |    */
    // TODO : Refactor the design of this (resource cleanup needs to be cleaned up in general).
    this.remove_from_root_attachmentables_if_needed = function(object_to_check) {
        let index_to_remove = -1;
        let i;
        for (i = 0; i < this.world.root_attachables.length; i++) {
            if (this.world.root_attachables[i] === object_to_check) {
                index_to_remove = i;
                break;
            }
        }
        if (index_to_remove !== NOT_FOUND) {
            this.world.root_attachables.splice(index_to_remove, 1);
        }
    };

    this.fully_remove_self_and_all_sub_attachments = function() {
        let a;
        for (a = 0; a < this.attachments.length; a++) {
            this.attachments[a].fully_remove_self_and_all_sub_attachments();
        }

        this.remove_from_root_attachmentables_if_needed(this);
        this.world.remove_from_interactive_then_scene(this);
        this.full_remove();
    };

    this.delete_mesh = function() {
        if (is_defined(this.mesh)) {
            this.object3D.remove(this.mesh);
        }
        if (is_defined(this.geometry)) {
            this.geometry.dispose();
        }
        this.mesh = undefined;
    };

    this.delete_material = function() {
        if (is_defined(this.material)) {
            if (is_defined(this.material.map)) {
                this.material.map.dispose();
                this.material.map = undefined;
            }
            this.material.dispose();
            this.material = undefined;
        }
    };

    this.full_remove = function() {
        this.delete_mesh();
        this.delete_material();
        // Specific to FloatingText2D.
        if (is_defined(this.dynamic_texture)) {
            // TODO : Eventually double check this.
            if (is_defined(this.dynamic_texture.dispose)) {
                this.dynamic_texture.dispose();
            }
            if (is_defined(this.dynamic_texture.texture)) {
                if (is_defined(this.dynamic_texture.texture.dispose)) {
                    this.dynamic_texture.texture.dispose();
                }
            }
        }
    };

    /*      ___  ___  __                         ___          ___    ___  __
     | |\ |  |  |__  |__) |\ |  /\  |       |  |  |  | |    |  |  | |__  /__`
     | | \|  |  |___ |  \ | \| /~~\ |___    \__/  |  | |___ |  |  | |___ .__/ */
    this._refresh_look_at = function() {
        let normal = this.get_normal();
        this._look_at_position.set(this.object3D.position.x + normal.x * 100, this.object3D.position.y + normal.y * 100, this.object3D.position.z + normal.z * 100);
        //let look_at_position = new THREE.Vector3(this.object3D.position.x + normal.x * 100, this.object3D.position.y + normal.y * 100, this.object3D.position.z + normal.z * 100);
        this.object3D.lookAt(this._look_at_position);
    };
}
