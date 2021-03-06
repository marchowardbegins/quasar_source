'use strict';

Object.assign(
    $_QE.prototype.PlayerCursor.prototype,
    {
        attached_to: null,
        _dx        : null,
        _dy        : null,

        _initialize_default_cursor: function() {
            this._cursor_default = new $_QE.prototype.DomElementExternal().initialize_dom_element(GLOBAL_ID_CURSOR_DEFAULT);
        },

        _set_to_cursor_default: function() {
            this.hide();
            this._cursor_default.show();

            this.clear_flags();
            this.set_flag_on(CURSOR_FLAG_DEFAULT);

            this.attached_to = null;
        },
    }
);
