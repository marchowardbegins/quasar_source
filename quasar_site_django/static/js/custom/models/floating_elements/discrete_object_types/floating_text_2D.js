'use strict';

function FloatingText2D(world, width, text_height, text) {
    this.__init__(world, width, text_height, text);
}

FloatingText2D.prototype = {

    __init__: function(world, width, text_height, text) {
        // Inherit.
        Text2D.call(this, world, width, text_height, text);

        //this.set_default_background_color(COLOR_SEMI_TRANSPARENT, false);
        //this.set_default_foreground_color(COLOR_TEXT_CONSTANT, false);

        this.maintain_engage_when_tabbed_to = false;
        this.engable = false;

        this.create_base_dynamic_texture();
        this.create_base_mesh();
    }

};