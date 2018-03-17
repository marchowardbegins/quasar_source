'use strict';

function Floating3DText(text, type, world) {
    this.__init__(text, type, world);
}

Floating3DText.prototype = {

    refresh_for_3D_text: function() {
        if (this.type === TYPE_ICON) {
            // TODO :
            l('REFRESH THIS ICON!! not really though');
        } else {

            var was_engaged = this.is_engaged();

            this.full_remove();
            this._create_3D_text_internally();

            if (was_engaged) {
                //this.world.interactive_objects.push(this);
            }
        }
    },

    _calculate_dimensions: function() {
        var box = new THREE.Box3().setFromObject(this.mesh);
        this.width = box.max.x;
        this.height = box.max.y;
    },

    __init__: function(text, type, world) {
        // Inherit.
        Attachmentable.call(this, world);
        FloatingText.call(this, text, type, false);
        Animatable.call(this);

        // TODO : Investigate into making these variables more dynamic.
        if (this.type === TYPE_SUPER_TITLE) {
            this.height = 32 * 4;
            this.size = 40 * 4;
            this.text_height = 2 * 4;
        } else if (this.type === TYPE_TITLE) {
            this.height = 32;
            this.size = 40;
            this.text_height = 2;
        } else {
            this.height = 16;
            this.size = 20;
            this.text_height = 1;
        }

        // Inherit from Interactive.
        Interactive.call(this);
        // Inherit from Visibility.
        Visibility.call(this);

        this.final_initialize();

        this.maintain_engage_until_right_click = true;

        //this._create_3D_text_internally();
    },

    _create_3D_text_internally: function() {
        this.material = new THREE.MeshLambertMaterial({color: this.current_color});

        this.create_base_mesh();

        // TODO : DoubleSide is temporary.
        this.material.side = THREE.DoubleSide;
        this.material.needsUpdate = true;
    },

    /*__   __   ___      ___    __
     /  ` |__) |__   /\   |  | /  \ |\ |
     \__, |  \ |___ /~~\  |  | \__/ | \| */
    create_base_mesh: function() {
        this.geometry = new THREE.TextGeometry(this.text, {
            size: this.size,
            height: this.text_height,
            curveSegments: 2,
            font: GLOBAL_FONT
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this._calculate_dimensions();
        this.object3D.add(this.mesh);
    },

    /*__   ___  __   __        __   __   ___     __        ___                 __
     |__) |__  /__` /  \ |  | |__) /  ` |__     /  ` |    |__   /\  |\ | |  | |__)
     |  \ |___ .__/ \__/ \__/ |  \ \__, |___    \__, |___ |___ /~~\ | \| \__/ |    */
    delete_mesh: function() {
        if (is_defined(this.mesh)) {
            this.object3D.remove(this.mesh);
        }
        if (is_defined(this.geometry)) {
            this.geometry.dispose();
        }
    },

    full_remove: function() {
        if (is_defined(this.mesh)) {
            this.object3D.remove(this.mesh);
        }
        if (is_defined(this.geometry)) {
            this.geometry.dispose();
        }
        if (is_defined(this.material)) {
            this.material.dispose();
        }
        if (is_defined(this.dynamic_texture)) {
            this.dynamic_texture.dispose();
        }
    },

};