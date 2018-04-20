'use strict';

function Text2D(world, width, height, text) {

    // Inherit.
    FloatingElement.call(this, world);
    TextAbstraction.call(this, text);

    this.width = width;
    this.height = height;
    this.dynamic_width = false;

    this.canvas = new CanvasTexture();

    this.initialized = false;
    this.needs_hex_colors = true;

    this.refresh = function() {
        if (this.initialized) {
            if (this.dynamic_width) {
                if (this.text_changed) {
                    l('Text changed!');
                    this.width = null;
                    this.process_width();
                    this.canvas.modify_canvas(this.width, this.height);
                    this.delete_mesh();
                    this.delete_material();
                    this.create_base_material();
                    this.create_base_mesh();

                    // Update horizontal offset if needed.
                    if (this.is_attached()) {
                        if (this.is_left_attachment) {
                            this.set_attachment_horizontal_distance_offset(-this.width / 2);
                        } else if (this.is_right_attachment) {
                            this.set_attachment_horizontal_distance_offset(this.width / 2);
                        }
                        this.attachment_parent.refresh_position_and_look_at();
                    }
                }
            }

            this.canvas.update(this.get_current_background_color(), this.get_current_foreground_color(), this.get_display_text());
            this.material.needsUpdate = true;

            this.text_changed = false;
            this.color_changed = false;
        }
    };

    /*__   ___ ___ ___  ___  __   __
     /__` |__   |   |  |__  |__) /__`
     .__/ |___  |   |  |___ |  \ .__/ */
    this.set_text_property_centered = function (is_centered) {
        this.canvas.set_font_property_centered(is_centered);
        //this.refresh();
    };

    this.set_text_property_bold = function(is_bold) {
        this.canvas.set_font_property_bold(is_bold);
        //this.refresh();
    };

    this.set_text_property_italic = function(is_italic) {
        this.canvas.set_font_property_italic(is_italic);
        //this.refresh();
    };

    /*__   __   ___      ___    __
     /  ` |__) |__   /\   |  | /  \ |\ |
     \__, |  \ |___ /~~\  |  | \__/ | \| */
    this.process_width = function() {
        if (!is_defined(this.width)) {
            this._original_text_width = MANAGER_TEXT_2D.get_width_needed(this.get_display_text(), this.height);
            this.width                = get_nearest_power_of_two_for_number(this._original_text_width);
            this.dynamic_width        = true;
            this.ratio                = this._original_text_width / (get_next_highest_power_of_two(this.width * 2));
        }
    };

    this.initialize = function() {
        this.process_width();

        this.canvas.set_dimensions(this.width, this.height);
        this.canvas.initialize();

        this.create_base_material();
        this.create_base_mesh();
        this.initialized = true;
        this.refresh();
    };

    this.create_base_material = function() {
        this.material = new THREE.MeshToonMaterial({
            map : this.canvas.texture, transparent: true, side: THREE.FrontSide
        });
        this.material.transparent = true;
        this.material.side = THREE.FrontSide;
    };

    this.create_base_mesh = function() {
        if (this.dynamic_width) {
            this.width *= this.ratio;
            this.geometry = new THREE.PlaneGeometry(this.width, this.height);

            this.geometry.faceVertexUvs[0][0][2].x = this.ratio;
            this.geometry.faceVertexUvs[0][1][1].x = this.ratio;
            this.geometry.faceVertexUvs[0][1][2].x = this.ratio;

            this.geometry.uvsNeedUpdate = true;
        } else {
            this.geometry = new THREE.PlaneGeometry(this.width, this.height);
        }

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.object3D.add(this.mesh);
    };
}