'use strict';

$_QE.prototype.FeaturePosition = function(world) {

    this.object3D = new THREE.Object3D();
    this.object3D.matrixAutoUpdate = false;
    this.world    = world;
    this.world.add_to_scene(this.object3D);

    this.offset_horizontal_distance   = 0;
    this.offset_horizontal_percentage = 0;
    this.offset_vertical_distance     = 0;
    this.offset_vertical_percentage   = 0;
    this.offset_depth_distance        = 0;

    // For optimization.
    this._position_offset = new THREE.Vector3(0, 0, 0);
    this._look_at_position = new THREE.Vector3(0, 0, 0);

    /*__   __   ___  __       ___    __        __
     /  \ |__) |__  |__)  /\   |  | /  \ |\ | /__`
     \__/ |    |___ |  \ /~~\  |  | \__/ | \| .__/ */
    this.refresh_for_render = function() {


        this.refresh_matrix();
    };

    this.refresh_for_render_recursively = function() {

    };

    this.refresh_matrix = function() {
        this.object3D.updateMatrix();
        this.object3D.matrixWorldNeedsUpdate = true;
    };


    // WARNING : This is recursive. Change the design later.
    this.update_all_child_attachments = function() {
        let parent_position = this.get_position();

        let a;
        for (a = 0; a < this.attachments.length; a++) {
            this.attachments[a].set_position(parent_position.x, parent_position.y, parent_position.z, false);
            this.attachments[a]._refresh_look_at();

            this.attachments[a].object3D.updateMatrix();
            this.attachments[a].object3D.matrixWorldNeedsUpdate = true;

            if (this.attachments.length > 0) {
                this.attachments[a].update_all_child_attachments();
            }
        }
    };

    this.refresh_position_and_look_at = function() {
        this._refresh_look_at();

        this.object3D.updateMatrix();
        this.object3D.matrixWorldNeedsUpdate = true;

        this.update_all_child_attachments();

        if (is_defined(this.post_position_update)) {
            this.post_position_update();
        }
    };

    this._refresh_look_at = function() {
        let normal = this.get_normal();
        this._look_at_position.set(this.object3D.position.x + normal.x * 100, this.object3D.position.y + normal.y * 100, this.object3D.position.z + normal.z * 100);
        //let look_at_position = new THREE.Vector3(this.object3D.position.x + normal.x * 100, this.object3D.position.y + normal.y * 100, this.object3D.position.z + normal.z * 100);
        this.object3D.lookAt(this._look_at_position);
    };

    /*__   ___ ___ ___  ___  __   __
     /__` |__   |   |  |__  |__) /__`
     .__/ |___  |   |  |___ |  \ .__/ */
    this.set_position = function(x, y, z) {
        if (this.is_root_attachment()) {
            this.object3D.position.set(x, y, z);
        } else {
            this.set_position_offset();
            this.object3D.position.set(x + this._position_offset.x, y + this._position_offset.y, z + this._position_offset.z);
        }
    };

    this.set_position_offset = function() {
        let normal = this.get_normal();

        let dx = 0;
        let dy = 0;
        let dz = 0;

        let magnitude = this.offset_horizontal_distance;
        if (this.offset_horizontal_parent_width_percentage !== 0) {
            magnitude += this.attachment_parent.width * this.offset_horizontal_parent_width_percentage;
        }

        let left_right = this.get_left_right();
        dx += left_right.x * magnitude;
        dy += left_right.y * magnitude;
        dz += left_right.z * magnitude;

        // TODO : WARNING : For now this only supports y-normals of 0.
        dy += this.offset_vertical_distance;
        if (this.offset_vertical_parent_height_percentage !== 0) {
            dy += this.offset_vertical_parent_height_percentage * this.attachment_parent.height;
        }

        if (this.offset_depth_distance !== 0) {
            dx += normal.x * this.offset_depth_distance;
            dy += normal.y * this.offset_depth_distance;
            dz += normal.z * this.offset_depth_distance;
        }

        this._position_offset.set(dx, dy, dz);
    };


    /*__   ___ ___ ___  ___  __   __
     / _` |__   |   |  |__  |__) /__`
     \__> |___  |   |  |___ |  \ .__/ */
    this.get_horizontal_distance_to_center = function(x, z) {
        return Math.sqrt((x - this.object3D.position.x) * (x - this.object3D.position.x) + (z - this.object3D.position.z) * (z - this.object3D.position.z));
        //return sqrt(squared(x - this.object3D.position.x) + squared(z - this.object3D.position.z));
    };

    this.get_parent_position = function() {
        return this.attachment_parent.object3D.position;
    };

    this.get_position = function() {
        return this.object3D.position;
    };

};