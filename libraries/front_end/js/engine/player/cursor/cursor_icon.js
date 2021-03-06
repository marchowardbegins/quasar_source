'use strict';

Object.assign(
    $_QE.prototype.PlayerCursor.prototype,
    $_QE.prototype.CanvasRendererCursorIcon.prototype,
    {
        _player_offset: 1400,

        _need_move_icon: function() {
            return this.attached_to.get_flag(EFLAG_ENGABLE_ONLY_FROM_DOUBLE_CLICK) && this.attached_to.get_flag(EFLAG_MOUSE_MOVEABLE);
        },

        _set_needed_on_attach_icon: function() {
            if (this.attached_to.get_flag(EFLAG_CLICKABLE) && !this.attached_to.get_flag(EFLAG_TYPING)) {
                this.set_current_icon(ASSET_ICON_CLICK);
            } else if (this.attached_to.get_flag(EFLAG_TYPING)) {
                this.set_current_icon(ASSET_ICON_WRITTING);
            } else if (this.attached_to.get_flag(EFLAG_MOUSE_SCALEABLE)) {
                //if (this.dx < .02 && this._dx > .98 && this._dy < .02 && this._dy > .98) {
                this.set_current_icon(ASSET_ICON_EXPAND);
            } else if (this.attached_to.get_flag(EFLAG_MOUSE_MOVEABLE)) {

                this.set_current_icon(ASSET_ICON_DRAG);
            } else {
                QE.log_warning('Missing cursor state!');
            }
        },

        _set_needed_on_engage_icon: function() {
            if (this.attached_to.get_flag(EFLAG_ENGABLE_ONLY_FROM_DOUBLE_CLICK) && this.attached_to.get_flag(EFLAG_MOUSE_MOVEABLE)) {

            }
        },

        engage: function() {
            this.set_flag_on(CURSOR_FLAG_ENGAGED);

            //this._current_icon === ASSET_ICON_DRAG
            if (this._need_move_icon()) {
                QE.player.set_in_front_of_object(this.attached_to, this._player_offset);
                QE.set_flag_on(ENGINE_STATE_MOUSE_Y_DISABLED);
                this.set_flag_on(CURSOR_FLAG_MOVING);

                this.set_current_icon(ASSET_ICON_DRAG);
            } else {
                // TODO:
                l('TODO: Handle other cases.');
                this.hide();
            }
        },

        disengage: function() {
            this.set_flag_off(CURSOR_FLAG_ENGAGED);
            this.set_flag_off(CURSOR_FLAG_MOVING);
            this.set_flag_off(CURSOR_FLAG_SCALING);
            QE.set_flag_off(ENGINE_STATE_MOUSE_Y_DISABLED);
            this.show();

            if (this.attached_to != null) {
                this._set_needed_on_attach_icon();
            }
        },

        on_wheel_event: function(delta) {
            if (delta == 1) {
                this._player_offset *= 1.025;
            } else {
                this._player_offset *= 0.975;
            }
        },
    }
);
