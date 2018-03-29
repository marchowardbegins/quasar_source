'use strict';

const _SMUDGE_FACTOR = 0.85;
const TEXT_PROPERTY_REGULAR         = [false, false];
const TEXT_PROPERTY_JUST_BOLD       = [false, true];
const TEXT_PROPERTY_JUST_ITALIC     = [true, false];
const TEXT_PROPERTY_ITALIC_AND_BOLD = [true, true];

function CanvasAbstraction(width, height) {
    this.__init__(width, height);
}

// TODO : Add font options!
CanvasAbstraction.prototype = {
    __init__: function(width, height) {
        this.width     = get_nearest_power_of_two_for_number(width  * 2);
        this.set_height(height);

        this.text_property_centered = null;
        this.text_property_bold     = null;
        this.text_property_italic   = null;

        this.canvas        = document.createElement('canvas');
        this.canvas.width  = this.width;
        this.canvas.height = this.height;
        this.context       = this.canvas.getContext('2d');

        this.font_needs_updating = false;
    },

    set_font_property_bold: function(is_bold) {
        this.text_property_bold  = is_bold;
        this.font_needs_updating = true;
    },

    set_font_property_italic: function(is_italic) {
        this.text_property_italic = is_italic;
        this.font_needs_updating  = true;
    },

    set_height: function(height) {
        this.height = get_nearest_power_of_two_for_number(height * 2);
    },

    update_font: function() {
        this.font_size = int(this.height * _SMUDGE_FACTOR);
        var additional_properties = '';
        if (is_defined(this.text_property_italic)) {
            if (this.text_property_italic) {
                additional_properties += 'italic ';
            }
        }
        if (is_defined(this.text_property_bold)) {
            if (this.text_property_bold) {
                additional_properties += 'bold ';
            }
        }
        this.font         = additional_properties + str(this.font_size) + 'px Arial';
        this.context.font = this.font;
        this.font_needs_updating = false;
    },

    set_font: function() {
        this.font_size    = int(this.height * _SMUDGE_FACTOR);
        this.font         = str(this.font_size) + 'px Arial';
        this.context.font = this.font;
    },

    initialize: function() {
        this.set_font();
        this.texture = new THREE.Texture(this.canvas);
        this.texture.anisotropy = MANAGER_RENDERER.renderer.capabilities.getMaxAnisotropy();
    },

    render: function(background_color, foreground_color, text) {
        if (this.font_needs_updating) {
            this.update_font();
        }

        this.context.clearRect(0, 0, this.width, this.height);
        if (is_defined(background_color)) {
            this.context.fillStyle = background_color;
            this.context.fillRect(0, 0, this.width, this.height);
        }
        this.context.fillStyle = foreground_color;

        if (this.text_property_centered) {
            this.context.fillText(text, this.width / 2 - this.get_text_width_for_texture() / 2, int(this.font_size * .9));
        } else {
            this.context.fillText(text, 0, int(this.font_size * .9));
        }

        this.texture.needsUpdate = true;
    },

    get_text_width_for_texture: function(text) {
        if (this.font_needs_updating) {
            this.update_font();
        }
        return this.context.measureText(text).width;
    }
};