'use strict';

function Floating3DText(text, type, world) {
    this.__init__(text, type, world);
}

Floating3DText.prototype = {

    size: null,
    height: null,
    text_height: null,

    material: null,
    text_geometry: null,

    current_text_object: null,

    initialize: function() {
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

        this._update_text();
    },

    _calculate_dimensions: function() {
        var box = new THREE.Box3().setFromObject(this.current_text_object);
        this.width = box.max.x;
        this.height = box.max.y;
    },

    _update_text: function() {
        if (this.text_geometry !== null) {
            this.text_geometry.dispose();
            this.material.dispose();
        }

        if (this.current_text_object !== null) {
            this.object3D.remove(this.current_text_object);
            this.current_text_object.geometry.dispose();
            this.current_text_object.material.dispose();
        }

        this.text_geometry = new THREE.TextGeometry(this.text, {
            size: this.size,
            height: this.text_height,
            curveSegments: 2,
            font: GLOBAL_FONT
        });


        l('3D text is trying to set color to : ');
        l(this.current_color);
        this.material = new THREE.MeshLambertMaterial({color: this.current_color});
        this.current_text_object = new THREE.Mesh(this.text_geometry, this.material);

        this._calculate_dimensions();

        this.object3D.add(this.current_text_object);

        this.material.side = THREE.FrontSide;
        this.material.color.setHex(this.current_color);
        this.material.needsUpdate = true;

        if (is_defined(this.world)) {
            this.world.scene.add(this.object3D);
        }
    },

    __init__: function(text, type, world) {



        // Inherit from FloatingText.
        FloatingText.call(this, 0, text, type, world, false);
        // Inherit from Interactive.
        Interactive.call(this);
        // Inherit from Visibility.
        Visibility.call(this);

        this.final_initialize();
    }
};