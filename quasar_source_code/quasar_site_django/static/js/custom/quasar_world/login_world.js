'use strict'

function LoginWorld() {
    this.__init__()
}

LoginWorld.prototype = {

    scene: null,

    player: null,

    // Create account fields.
    create_username: null,

    set_player_look_at: null,

    interactive_objects : null,

    __init__: function() {
        // Create the scene.
        this.scene = new THREE.Scene()

        // Going to try to create a plane here.
        var plane_geometry = new THREE.PlaneGeometry(2000, 2000, 100, 100)
        plane_geometry.applyMatrix(new THREE.Matrix4().makeRotationX(- Math.PI / 2))
        //var plane_material = new THREE.MeshBasicMaterial({color: 0x0000ff})
        var plane_material = new THREE.MeshLambertMaterial({color: 0xccffcc, side: THREE.FrontSide, wireframe: true})
        var plane_mesh     = new THREE.Mesh(plane_geometry, plane_material)
        this.add_to_scene(plane_mesh)

        // Add lights.
        /*
        var color1 = '#b9ffd2'
        var color2 = '#090920'
        var light = new THREE.HemisphereLight(color1, color2, .5)
        this.add_to_scene(light)
        */

        var light3 = new THREE.PointLight(0xccffcc, .8, 0)
        light3.position.set(5, 100, 5)
        this.add_to_scene(light3)

        // AJAX status.


        // Login fields.
        this.login_username = new FloatingLabelInput(150, 20, 'Username :', TYPE_INPUT_REGULAR, this.scene)
        this.login_username.update_position(0, 100, 45)

        this.login_password = new FloatingLabelInput(150, 20, 'Password :', TYPE_INPUT_PASSWORD, this.scene)
        this.login_password.update_position(0, 75, 45)

        this.login_button = new Floating2DText(150, 20, 'Login', TYPE_BUTTON, this.scene)
        this.login_button.update_position_and_look_at(new THREE.Vector3(150 / 2, 50, 45), new THREE.Vector3(150 / 2, 50, 55))

        // Create account fields.
        this.create_username = new FloatingLabelInput(150, 20, 'Username :', TYPE_INPUT_REGULAR, this.scene)
        this.create_username.update_position(200, 100, 45)

        this.create_email = new FloatingLabelInput(150, 20, 'Email :', TYPE_INPUT_REGULAR, this.scene)
        this.create_email.update_position(200, 75, 45)

        this.create_password = new FloatingLabelInput(150, 20, 'Password :', TYPE_INPUT_PASSWORD, this.scene)
        this.create_password.update_position(200, 50, 45)

        this.create_repeat_password = new FloatingLabelInput(150, 20, 'Repeat Password :', TYPE_INPUT_PASSWORD, this.scene)
        this.create_repeat_password.update_position(200, 25, 45)

        this.create_account_button = new Floating2DText(150, 20, 'Create Account', TYPE_BUTTON, this.scene)
        this.create_account_button.update_position_and_look_at(new THREE.Vector3(200 + 150 / 2, 0, 45), new THREE.Vector3(200 + 150 / 2, 0, 46))

        // Create a list of the interactive floating texts.
        this.interactive_objects = [
            this.login_button,
            this.create_account_button,
            this.login_username.floating_input,
            this.login_password.floating_input,
            this.create_username.floating_input,
            this.create_email.floating_input,
            this.create_password.floating_input,
            this.create_repeat_password.floating_input]

        // Handle key press events.
        document.addEventListener('keydown', this.on_key_press.bind(this), false)

        this.set_player_look_at = false
    },

    add_to_scene: function(object) {
        this.scene.add(object)
    },

    update: function() {
        if (this.set_player_look_at) {
            this.player.look_at(new THREE.Vector3(0, 70, 45))
            this.set_player_look_at = false
        }

        //var position = this.player.fps_controls.get_position()
        //var direction = this.player.fps_controls.get_direction()

        var raycaster = new THREE.Raycaster(this.player.fps_controls.get_position(), this.player.fps_controls.get_direction())

        for (var i = 0; i < this.interactive_objects.length; i++) {
            this.interactive_objects[i].look_away()
            var intersections = raycaster.intersectObject(this.interactive_objects[i].object3d, true)
            if (intersections.length > 0) {
                this.interactive_objects[i].look_at()
            }
        }
    },

    on_key_press: function(event) {

        //console.log(event)
        var i

        if (event.keyCode == 220) { // backslash
            if (this.player.is_engaged()) {
                for (i = 0; i < this.interactive_objects.length; i++) {
                    if (this.interactive_objects[i].being_looked_at) {
                        this.interactive_objects[i].disengage(this.player)
                    }
                }
            }
        }

        for (i = 0; i < this.interactive_objects.length; i++) {
            if (this.interactive_objects[i].is_engaged()) {
                this.interactive_objects[i].parse_keycode(event)
            }
        }

        if (event.keyCode == 69) { // e
            for (i = 0; i < this.interactive_objects.length; i++) {
                if (this.interactive_objects[i].being_looked_at) {
                    this.interactive_objects[i].engage(this.player)
                }
            }
        }

    },

    enter_world: function() {
        if (this.player == null) {
            this.set_player_look_at = true
        } else {
            this.player.look_at(new THREE.Vector3(0, 70, 45))
        }
    },

    exit_world: function() {

    }
}