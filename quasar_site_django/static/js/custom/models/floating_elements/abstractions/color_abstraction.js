'use strict';

function ColorAbstraction(needs_hex_colors) {

    this.needs_hex_colors = needs_hex_colors;
    if (!is_defined(this.needs_hex_colors)) {
        this.needs_hex_colors = false;
    }

    // TEMPORARY VALUES
    this.current_background_color = COLOR_RED;
    this.default_background_color = COLOR_RED;

    this.override_background_color = null;

    // TEMPORARY VALUES
    this.current_foreground_color = COLOR_TEXT_DEFAULT;
    this.default_foreground_color = COLOR_TEXT_DEFAULT;

    this.override_foreground_color = null;


    this.color_changed            = false;

    this.get_current_background_color = function() {
        if (is_defined(this.override_background_color)) {
            return this.override_background_color;
        }
        if (this.needs_hex_colors) {
            //return this.current_background_color.getHex();
            return '#' + this.current_background_color.getHexString();
        } else {
            return this.current_background_color;
        }
    };

    this.get_current_foreground_color = function() {
        if (is_defined(this.override_foreground_color)) {
            return this.override_foreground_color;
        }
        if (this.needs_hex_colors) {
            //return this.current_foreground_color.getHex();
            return '#' + this.current_foreground_color.getHexString();
        } else {
            return this.current_foreground_color;
        }
    };

    this.set_current_background_color = function(color, refresh) {
        this.current_background_color = color;
        if (is_defined(refresh)) {
            if (refresh) {
                if (is_defined(this.current_background_color_changed)) {
                    this.current_background_color_changed();
                }
            }
        }
    };

    this.set_default_background_color = function(color, refresh) {
        this.default_background_color = color;
    };

    this.set_current_foreground_color = function(color, refresh) {
        this.current_foreground_color = color;
        if (is_defined(refresh)) {
            if (refresh) {
                if (is_defined(this.current_foreground_color_changed)) {
                    this.current_foreground_color_changed();
                }
                if (is_defined(this.refresh)) {
                    this.refresh();
                }
            }
        }
    };

    this.set_default_foreground_color = function(color, refresh) {
        this.default_foreground_color = color;
        if (is_defined(refresh)) {
            if (refresh) {
                if (is_defined(this.refresh)) {
                    this.refresh();
                }
            }
        }
    };

}



/*__   __        __   __      __   __   ___  __       ___    __        __
 /  ` /  \ |    /  \ |__)    /  \ |__) |__  |__)  /\   |  | /  \ |\ | /__`
 \__, \__/ |___ \__/ |  \    \__/ |    |___ |  \ /~~\  |  | \__/ | \| .__/ */
/*

    this._parse_color = function(c) {
        if (is_list(c)) {
            if (this.is_2D_text) {
                return c[COLOR_STRING_INDEX];
            }
            return c[COLOR_HEX_INDEX];
        } else {
            //l('A non list color was passed?');
            //(c);
            return c;
        }
    };

    this.set_background_color = function(color, refresh) {
        this.current_background_color = this._parse_color(color);
        this.color_changed = true;
        if (is_defined(refresh)) {
            if (refresh) {
                this.refresh();
            }
        }
    };

    this.set_default_background_color = function(color, refresh) {
        this.default_background_color = this._parse_color(color);
        if (!is_defined(this.current_background_color)) {
            this.current_background_color = this.default_background_color;
        }
        this.color_changed = true;
        if (is_defined(refresh)) {
            if (refresh) {
                this.refresh();
            }
        }
    };

    this.set_color = function(color, refresh) {
        this.current_color = this._parse_color(color);
        this.color_changed = true;
        if (is_defined(refresh)) {
            if (refresh) {
                this.refresh();
            }
        }
    };

    this.set_default_color = function(color, refresh) {
        this.default_color = this._parse_color(color);
        if (!is_defined(this.current_color)) {
            this.current_color = this.default_color;
        }
        this.color_changed = true;
        if (is_defined(refresh)) {
            if (refresh) {
                this.refresh();
            }
        }
    };

 */