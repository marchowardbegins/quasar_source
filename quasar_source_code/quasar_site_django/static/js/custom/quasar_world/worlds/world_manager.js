'use strict';

function WorldManager() {
    this.__init__();
}

WorldManager.prototype = {
    previous_world : null,
    current_world  : null,

    current_player_menu: null,

    // Pre-defined worlds.
    world_login    : null,
    world_home     : null,
    world_settings : null,

    world_global   : null,

    world_admin    : null,

    __init__: function() {
        this.world_login = new LoginWorld();
        this.world_home = new HomeWorld();
        this.world_settings = new SettingsWorld();
    },

    //this.world_home.add_css_scene();

    update_current_world: function(delta) {
        if (GUI_PAUSED_MENU.is_visible()) {
            return;
        }

        // TODO : Double check on what order these should update.

        if (MANAGER_WORLD.current_player_menu.is_visible()) {
            MANAGER_WORLD.current_player_menu.update(delta);
        }

        for (var a = 0; a < this.current_world.root_attachables.length; a++) {
            if (this.current_world.root_attachables[a].has_animation && this.root_attachables[a].requires_animation_update) {
                this.current_world.root_attachables[a].update(delta);
            }
            this.current_world.root_attachables[a].update_all_child_animations_recursively(delta);
        }

        if (!this.current_world.floating_cursor._currently_engaged) {
            this.current_world.update_interactive_objects();
        }

        this.current_world.floating_cursor.update();

        //this.current_world.floating_cursor.update();
    },

    set_current_world: function(world) {
        if (this.current_world !== null) {
            // Before exiting the world make sure to remove the camera reference.
            this.current_world.remove_from_scene(CURRENT_PLAYER.fps_controls.yaw);
            this.current_world.exit_world();

            // TODO : figure out if this is used
            //this.current_world.current_world = false;

            this.previous_world = this.current_world;
        }
        this.current_world = world;
        this.current_floating_cursor = this.current_world.floating_cursor;
        this.current_player_menu = this.current_world.player_menu;

        // Before adding the world make sure to add the camera reference.
        this.current_world.add_to_scene(CURRENT_PLAYER.fps_controls.yaw);
        this.current_world.enter_world();
    },

    key_down_event: function(event) {
        this.current_world.key_down_event_for_interactive_objects(event);
    },

    add_to_all_scenes: function(object) {
        this.world_login.add_to_scene(object);
        this.world_home.add_to_scene(object);
        this.world_settings.add_to_scene(object);

        // TODO : Make sure dynamic worlds are dealt with.
    },

    create_world: function(world) {
        world.player_menu.create();
        world.player_menu.set_to_invisible();

        world.floating_cursor.create();

        var skybox_geometry = new THREE.BoxGeometry(15000, 15000, 15000);
        var skybox_cube = new THREE.Mesh(skybox_geometry, MANAGER_LOADING.sky_box_material);
        skybox_cube.position.set(0, 0, 0);
        world.add_to_scene(skybox_cube);


        // Default hex grid ground.
        var grid = new vg.HexGrid({cellSize: 100});
        grid.generate({size: 10});
        var board = new vg.Board(grid);
        board.generateTilemap({cellSize: 100, tileScale: 0.99});
        world.add_to_scene(board.group);

        // Default lights.
        this.lights = [];

        var light3 = new THREE.PointLight(0xccffcc, .5, 0);
        light3.position.set(5, 100, 5);
        world.add_to_scene(light3);

        var lightr = new THREE.PointLight(0xff8579, .5, 0);
        lightr.position.set(1000, 100, 0);
        world.add_to_scene(lightr);

        var lightg = new THREE.PointLight(0xb1ff90, .5, 0);
        lightg.position.set(0, 100, 1000);
        world.add_to_scene(lightg);

        var lightb = new THREE.PointLight(0x84b5ff, .5, 0);
        lightb.position.set(500, 100, 500);
        world.add_to_scene(lightb);
        /////////////////

        var light = new THREE.AmbientLight(0xffffff, .25); // soft white light
        world.add_to_scene(light);


        // Now finally create the actual world.
        world.create();
    }

};


