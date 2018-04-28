'use strict';

function FloatingIcon(world, icon_type, size) {
    this.__init__(world, icon_type, size);
}

FloatingIcon.prototype = {

    __init__: function(world, icon_type, size) {
        // Inherit.
        FloatingElement.call(this, world);

        this.icon_type = icon_type;
        this.width = size;
        this.height = size;

        this._current_icon = icon_type;

        this.create_base_material();
        this.create_base_mesh();
    },

    switch_icon: function(icon) {
        if (this._current_icon !== icon) {
            this.material.uniforms['offset'].value = MANAGER_SPRITESHEET.get_icon_offset(icon);
            this.material.needsUpdate = true;
            this._current_icon = icon;
        }
    },

    switch_icon_and_color: function(icon, color) {
        this.switch_icon(icon);
        this.material.uniforms['color'].value = color;
        this.material.needsUpdate = true;
    },

    /*__   __   ___      ___    __
     /  ` |__) |__   /\   |  | /  \ |\ |
     \__, |  \ |___ /~~\  |  | \__/ | \| */
    create_base_material: function() {
        this.material = MANAGER_SPRITESHEET.get_icon_material(this.icon_type);
    },

    create_base_mesh: function() {
        let geometry = MANAGER_HEAP.get_icon_geometry(this.width, this.height);
        //this.geometry = new THREE.PlaneGeometry(this.width, this.height);
        this.mesh = new THREE.Mesh(geometry, this.material);
        this.object3D.add(this.mesh);
    },

    /*__   __        __   __      __   __   ___  __       ___    __        __
     /  ` /  \ |    /  \ |__)    /  \ |__) |__  |__)  /\   |  | /  \ |\ | /__`
     \__, \__/ |___ \__/ |  \    \__/ |    |___ |  \ /~~\  |  | \__/ | \| .__/ */
    current_foreground_color_changed: function() {
        this.material.uniforms['color'].value = this.current_foreground_color;
        this.material.needsUpdate = true;
    }
};
