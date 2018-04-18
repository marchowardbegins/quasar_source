'use strict';

// TODO : Utilize the global color constants that already exist.
const LOG_MESSAGE_COLOR_RED = 'rgba(255, 53, 36, ';
const LOG_MESSAGE_COLOR_GREEN = 'rgba(0, 255, 0, ';
const LOG_MESSAGE_COLOR_CLIENT = 'rgba(0, 255, 218, ';
const LOG_MESSAGE_COLOR_MESSAGE = 'rgba(0, 111, 255, ';


function LogMessage(message, color, row_index) {
    this.__init__(message, color, row_index);
}

LogMessage.prototype = {

    __init__: function(message, color, row_index) {
        this.message = message;
        this.color   = color;
        this.row_index = row_index;
        this.current_delta = 0;
        this.current_alpha = 1.0;
        this.alpha_duration = 16.0;
    },

    get_text: function() {
        return this.message;
    },

    has_update: function() {
        return this.current_delta <= this.alpha_duration;
    },

    update: function(delta) {
        this.current_delta += delta;
        this.current_alpha = 1.0 - (this.current_delta / this.alpha_duration);
    },

    get_row_index: function() {
        return this.row_index;
    },

    get_color: function() {
        return this.color + this.current_alpha.toString() + ')';
    },

    increase_row_index: function() {
        this.row_index += 1;
    },

    reset_delta: function() {
        this.current_delta = 0;
    }

};