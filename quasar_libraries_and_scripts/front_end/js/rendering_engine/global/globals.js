'use strict';

/* __        __   __  ___  __       ___  __
  /__` |__| /  \ |__)  |  /  ` |  |  |  /__`
  .__/ |  | \__/ |  \  |  \__, \__/  |  .__/ */
const l = console.log;

function is_defined(object) {
    return object !== null && object !== undefined;
}

const COLOR_RED           = new THREE.Color('#ff5e33');
const COLOR_BLUE          = new THREE.Color('#0065ff');
const COLOR_GREEN         = new THREE.Color('#31ff00');
const COLOR_YELLOW        = new THREE.Color('#faff00');
const COLOR_WHITE         = new THREE.Color('#ffffff');
const COLOR_BLACK         = new THREE.Color('#000000');
const COLOR_TEXT_CONSTANT = new THREE.Color('#0b410f');
const COLOR_TEXT_DEFAULT  = new THREE.Color('#67ffbf');

const FLOATING_TEXT_BACKGROUND_TRANSPARENT = 'rgba(0, 0, 0, 0)';      // #pre-process_global_constant
const FLOATING_TEXT_BACKGROUND_DEFAULT     = 'rgba(20, 20, 20, .45)'; // #pre-process_global_constant
const FLOATING_TEXT_BACKGROUND_ERROR       = 'rgba(57, 0, 6, .45)';   // #pre-process_global_constant
const FLOATING_TEXT_BACKGROUND_SUCCESS     = 'rgba(30, 63, 30, .45)'; // #pre-process_global_constant

/*    ___          ___         __   __        __  ___           ___  __
 |  |  |  | |    |  |  \ /    /  ` /  \ |\ | /__`  |   /\  |\ |  |  /__`
 \__/  |  | |___ |  |   |     \__, \__/ | \| .__/  |  /~~\ | \|  |  .__/ */
const DIAGONAL_PENALTY = 0.7071067811865476; // #pre-process_global_constant
const ONE_FOURTH       = 0.25;               // #pre-process_global_constant
const ONE_THIRD        = 0.3333333333333333; // #pre-process_global_constant
const THREE_FOURTHS    = 0.75;               // #pre-process_global_constant
const TWO_THIRDS       = 0.6666666666666666; // #pre-process_global_constant
const HALF             = 0.5;                // #pre-process_global_constant

