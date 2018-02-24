'use strict';

function PlayerState() {

    this.previous_state = null;
    this.current_state = PLAYER_STATE_LOADING;

    this.set_state = function(player_state) {
        this.current_state = player_state;

        switch(player_state) {
        case PLAYER_STATE_LOADING:
        case PLAYER_STATE_AJAX:
        case PLAYER_STATE_PAUSED:
            // Dis-engage any engaged objects.
            var currently_looked_at_object = this.get_currently_looked_at_object();
            if (is_defined(currently_looked_at_object)) {
                if (currently_looked_at_object.is_engaged()) {
                    currently_looked_at_object.disengage();
                }
            }

            // Hide the player menu if visible.

            // Show the paused GUI menu.
            GUI_PAUSED_MENU.make_visible();

            break;
        case PLAYER_STATE_TYPING:
            GUI_TYPING_INTERFACE.show();
            break;
        }


        if (player_state === PLAYER_STATE_LOADING || player_state === PLAYER_STATE_AJAX) {
            // TODO : disengage from any engaged object.
            // TODO : remove player menu if present.
            this.fps_controls.disable();
        } else if (player_state === PLAYER_STATE_PAUSED) {
            GUI_PAUSED_MENU.set_to_paused();
            // TODO : disengage from any engaged object.
            // TODO : remove player menu if present.

        }
    };

    this.is_engaged = function() {
        return this.current_state === PLAYER_STATE_ENGAGED;
    };

    this.is_paused = function() {
        return this.current_state === PLAYER_STATE_PAUSED;
    };

    this.has_mouse_movement = function() {
        return this.current_state === PLAYER_STATE_FULL_CONTROL;
    };

    this.has_movement = function() {
        return this.current_state === PLAYER_STATE_FULL_CONTROL;
    };

    this.in_typing_state = function() {
        return this.current_state === PLAYER_STATE_TYPING;
    };

    this.add_text_and_leave_typing_state = function() {
        GUI_TYPING_INTERFACE.add_user_text();
        this.set_state(PLAYER_STATE_FULL_CONTROL);
    };

    this.has_paste_event = function() {
        if (this.current_state === PLAYER_STATE_TYPING) {
            return true;
        } else {
            var currently_looked_at_object = this.get_currently_looked_at_object();
            if (is_defined(currently_looked_at_object)) {
                if (currently_looked_at_object.is_engaged()) {
                    return true;
                }
            }
        }
        return false;
    };

    this.has_input = function() {
        return this.current_state === PLAYER_STATE_FULL_CONTROL || this.current_state === PLAYER_STATE_ENGAGED || this.current_state === PLAYER_STATE_TYPING; 
    };

    this.currently_loading = function() {
        return this.current_state === PLAYER_STATE_LOADING || this.current_state === PLAYER_STATE_AJAX;
    };

    this.get_currently_looked_at_object = function() {
        return MANAGER_WORLD.current_world.currently_looked_at_object;
    },

    this.engaged_with_object = function() {
        var currently_engaged_object = this.get_currently_looked_at_object();
        if (is_defined(currently_engaged_object)) {
            return currently_engaged_object.is_engaged();
        }
        return false;
    }
}
