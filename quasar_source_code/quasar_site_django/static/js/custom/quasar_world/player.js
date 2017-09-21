'use strict'

function Player(renderer_api) {
    this.__init__(renderer_api)
}

Player.prototype = {

    // Custom variables.
    logged_in       : null,

    // Three JS objects.
    camera          : null,

    // Custom objects.
    renderer_api    : null,
    pointer_lock_api: null,
    fps_controls    : null,
    data_display    : null,

    __init__: function(renderer_api) {
        this.renderer_api = renderer_api
        this.camera       = new THREE.PerspectiveCamera(this.renderer_api.field_of_view, this.renderer_api.aspect_ratio, this.renderer_api.near_clipping, this.renderer_api.far_clipping)
        this.renderer_api.camera = this.camera

        this.fps_controls = new FPSControls(this.camera)
        //this.renderer_api.add_to_scene(this.fps_controls.get_object())
        this.pointer_lock_api = new PointerLockAPI(this.fps_controls)

        this.data_display = new DataDisplay(this.fps_controls)

        // Set player state.
        this.logged_in = false
        //this.login_panel = new LoginPanel(renderer_api)
    },

    update: function(delta) {
        this.fps_controls.physics(delta)
        this.data_display.update()

        /*
        // Temp code.
        if (this.fps_controls.enabled) {
            var d = this.fps_controls.get_direction()
            var p = this.fps_controls.get_position()
            this.login_panel.update(p, d)
        }
        //this.login_panel.set_rotation(d.x, d.y, d.z)
        */
    }

}