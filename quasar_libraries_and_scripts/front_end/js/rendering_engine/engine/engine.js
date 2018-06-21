'use strict';

/*
// Global managers.
let MANAGER_MANAGER      = null;
let MANAGER_HEAP         = null;
let MANAGER_SPRITESHEET  = null;
let MANAGER_WEB_SOCKETS  = null;
let MANAGER_AUDIO        = null;
let MANAGER_TEXTURE      = null;
let MANAGER_WORLD        = null;
let MANAGER_ENTITY       = null;
//var MANAGER_MULTIPLAYER  = null;
let MANAGER_SHADER       = null;
let MANAGER_RENDERER     = null;
let MANAGER_INPUT        = null;
*/

let QE;

const APPLICATION_NEXUS_LOCAL   = 'nl'; // #pre-process_global_constant
const APPLICATION_QUASAR_PUBLIC = 'qp'; // #pre-process_global_constant

function $_QE() {
    this.__init__();
}

$_QE.prototype = {

    __init__: function() {
        console.log('Quasar Engine created!');
        this.UP_VECTOR = new THREE.Vector3(0, 1, 0);
    },

    /*__  ___       __  ___          __      __  ___  ___  __   __
     /__`  |   /\  |__)  |     |  | |__)    /__`  |  |__  |__) /__`
     .__/  |  /~~\ |  \  |     \__/ |       .__/  |  |___ |    .__/ */
    check_if_required_features_are_supported: function () {
        this.client = new $_QE.prototype.Client();
        this.client.initialize_state_canvas_support();
        this.client.initialize_state_webgl_support();
        this.client.initialize_pause_menu();
    },

    are_required_features_supported: function() {
        if (!(this.client.state_is_webgl_enabled && this.client.state_is_canvas_enabled)) {
            console.log('ERROR: WebGL or Canvas not supported!');
            return false;
        }
        return true;
    },

    initialize_and_set_application: function(application) {
        this.application = application;
        this.renderer    = new $_QE.prototype.RendererManager(this.client);
        this.client.pre_render_initialize(this.renderer);

        this.player = new $_QE.prototype.Player(this.renderer.camera, this.client);
        this.world_manager = new $_QE.prototype.WorldManager(this.player, this.renderer, this.application);

        this.world_manager.initialize_first_world();
    },

    /*___       __          ___          __   __       ___  ___          __   __   __
     |__  |\ | / _` | |\ | |__     |  | |__) |  \  /\   |  |__     |    /  \ /  \ |__)
     |___ | \| \__> | | \| |___    \__/ |    |__/ /~~\  |  |___    |___ \__/ \__/ |    */
    reset_delta: function() {

    }
};


/*
// Engine starts here!
window.onload = function() {
    QE = new $_QE();


    MANAGER_MANAGER = new ManagerManager();
    if (CURRENT_CLIENT.supports_webgl()) {
        MANAGER_MANAGER.load_all_global_managers();

        MANAGER_MANAGER.set_quasar_main_object(CURRENT_CLIENT, CURRENT_PLAYER, MANAGER_WORLD, MANAGER_RENDERER, MANAGER_MANAGER);

        MANAGER_MANAGER.initial_asset_loading_start(MANAGER_MANAGER.quasar_main_object);
    }

};




    get_window_properties: function() {
        this.window_width  = window.innerWidth;
        this.window_height = window.innerHeight;
        this.aspect_ratio  = this.window_width / this.window_height;
        CURRENT_CLIENT.height_re_sized(this.window_height);
    },
*/
