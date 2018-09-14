'use strict';

// TODO : Organize.

// Math
function get_horizontal_distance(x0, x1, z0, z1) {
    return Math.sqrt((x1 - x0) * (x1 - x0) + (z1 - z0) * (z1 - z0));
};

// Emoji list.
const EMOJI_SLEEPING = '😴'; // #pre-process_global_constant
const EMOJI_NERD     = '🤓'; // #pre-process_global_constant
const EMOJI_ERROR    = '😫'; // #pre-process_global_constant

/* __        __   __  ___  __       ___  __
  /__` |__| /  \ |__)  |  /  ` |  |  |  /__`
  .__/ |  | \__/ |  \  |  \__, \__/  |  .__/ */
// Testing if this is fixed.
const l = console.log;

// Logical constants.
const NOT_FOUND = -1; // #pre-process_global_constant

// TODO: remove this! (can just use object != null)
function is_defined(object) {
    return object !== null && object !== undefined;
}

const FLOATING_TEXT_BACKGROUND_DARK_GRAY   = 'rgba(40, 40, 41, .45)'; // #pre-process_global_constant
const FLOATING_TEXT_BACKGROUND_TRANSPARENT = 'rgba(0, 0, 0, 0)';      // #pre-process_global_constant
const FLOATING_TEXT_BACKGROUND_DEFAULT     = 'rgba(20, 20, 20, .45)'; // #pre-process_global_constant
const FLOATING_TEXT_BACKGROUND_ERROR       = 'rgba(57, 0, 6, .45)';   // #pre-process_global_constant
const FLOATING_TEXT_BACKGROUND_SUCCESS     = 'rgba(30, 63, 30, .45)'; // #pre-process_global_constant

function get_next_highest_power_of_two(n) {
    let v = n;
    v--;
    v |= v >> 1;
    v |= v >> 2;
    v |= v >> 4;
    v |= v >> 8;
    v |= v >> 16;
    v++; // next power of 2
    return v;
}

/*    ___          ___         __   __        __  ___           ___  __
 |  |  |  | |    |  |  \ /    /  ` /  \ |\ | /__`  |   /\  |\ |  |  /__`
 \__/  |  | |___ |  |   |     \__, \__/ | \| .__/  |  /~~\ | \|  |  .__/ */
const DIAGONAL_PENALTY = 0.7071067811865476; // #pre-process_global_constant
const ONE_FOURTH       = 0.25;               // #pre-process_global_constant
const ONE_THIRD        = 0.3333333333333333; // #pre-process_global_constant
const THREE_FOURTHS    = 0.75;               // #pre-process_global_constant
const TWO_THIRDS       = 0.6666666666666666; // #pre-process_global_constant
const HALF             = 0.5;                // #pre-process_global_constant




////

