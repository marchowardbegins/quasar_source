'use strict';

WorldManager.prototype = {

    logout: function() {
        this.dynamic_worlds = {};
        this.world_home.delete_all();
        this.world_settings.delete_all();
        this.world_admin.delete_all();
    },

    _singleton_transition_after_old_scene_fbo: function(current_world, previous_world) {
        this.environment.switch_to_new_world(previous_world, current_world);
    },

    set_current_world: function(world, transition_finished_callback) {
        if (is_defined(this.previous_world)) {
            this.player_menu.switch_to_new_world(this.previous_world, this.current_world);
            this.player_cursor.switch_to_new_world(this.previous_world, this.current_world);
            MANAGER_RENDERER.set_current_world(this.current_world, this.previous_world, transition_finished_callback, previous_position_and_look_at, this._singleton_transition_after_old_scene_fbo.bind(this, this.current_world, this.previous_world));
        } else {
            MANAGER_RENDERER.set_current_scene(this.current_world.scene, transition_finished_callback);
        }
    },

    perform_batch_save: function() {
        this.world_home.prepare_for_save();
        //this.world_settings.prepare_for_save();
        //this.world_admin.prepare_for_save();
        let relative_id;
        for (relative_id in this.dynamic_worlds) {
            if (this.dynamic_worlds.hasOwnProperty(relative_id)) {
                this.dynamic_worlds[relative_id].prepare_for_save();
            }
        }
    },

    /*     __   __                  __        __          __
     |    /  \ / _` | |\ |    |    /  \  /\  |  \ | |\ | / _`
     |___ \__/ \__> | | \|    |___ \__/ /~~\ |__/ | | \| \__> */
    all_entities_loaded: function(callback) {
        this.static_worlds_manager_entity = MANAGER_ENTITY.get_entity_of_type(ENTITY_TYPE_STATIC_WORLDS_MANAGER);
        this.dynamic_worlds_manager_entity = MANAGER_ENTITY.get_entity_of_type(ENTITY_TYPE_DYNAMIC_WORLDS_MANAGER);

        this.world_home_entity = this.static_worlds_manager_entity.get_child_entity_with_property_value(ENTITY_PROPERTY_NAME, ENTITY_STATIC_WORLD_HOME);
        this.world_settings_entity = this.static_worlds_manager_entity.get_child_entity_with_property_value(ENTITY_PROPERTY_NAME, ENTITY_STATIC_WORLD_SETTINGS);
        this.world_admin_entity = this.static_worlds_manager_entity.get_child_entity_with_property_value(ENTITY_PROPERTY_NAME, ENTITY_STATIC_WORLD_ADMIN);

        // Create the static worlds needed.
        this.world_home     = new HomeWorld(this.world_home_entity);
        this.world_settings = new SettingsWorld(this.world_settings_entity);
        this.world_admin    = new AdminWorld(this.world_admin_entity);

        this.world_home.create();
        this.world_settings.create();
        this.world_admin.create();

        // Create the dynamic worlds needed.
        // Iterate through the children of this entity. They each are a created world.
        let dynamic_worlds = this.dynamic_worlds_manager_entity.get_children();
        let c;
        for (c = 0; c < dynamic_worlds.length; c++) {
            let created_world_entity = dynamic_worlds[c];

            let created_world = new DynamicWorld(created_world_entity);

            // TODO : In the future only create the created worlds on first teleport into them! This will require significant refactoring though.
            created_world.create();
            this.add_dynamic_world(created_world);
        }

        this.all_dynamic_worlds_loaded();
        this.load_all_dynamic_content();
        //this.load_schedule_content();
        this.link_all_entities_for_notifications();

        callback();

        // All initial loading is completed so place the player into the home world.
        this.set_current_world(this.world_home);
    },

    /*__                         __           __   __        __   __                           __   ___        ___      ___
     |  \ \ / |\ |  /\   |\/| | /  `    |  | /  \ |__) |    |  \ /__`     |\/|  /\  |\ |  /\  / _` |__   |\/| |__  |\ |  |
     |__/  |  | \| /~~\  |  | | \__,    |/\| \__/ |  \ |___ |__/ .__/     |  | /~~\ | \| /~~\ \__> |___  |  | |___ | \|  |  */
    update_world_name_for_teleport_buttons: function(dynamic_world) {
        this.update_or_add_dynamic_world_to_all_other_dynamic_worlds_teleport_menu(dynamic_world);

        this.world_home.player_menu.update_or_add_personal_teleport_button(dynamic_world);
        this.world_settings.player_menu.update_or_add_personal_teleport_button(dynamic_world);
        this.world_admin.player_menu.update_or_add_personal_teleport_button(dynamic_world);
    },

    all_dynamic_worlds_loaded: function() {
        for (let relative_id in this.dynamic_worlds) {
            if (this.dynamic_worlds.hasOwnProperty(relative_id)) {

                for (let inner_relative_id in this.dynamic_worlds) {
                    if (this.dynamic_worlds.hasOwnProperty(inner_relative_id)) {
                        if (inner_relative_id !== relative_id) {
                            this.dynamic_worlds[inner_relative_id].player_menu.add_personal_teleport_button(this.dynamic_worlds[relative_id]);
                        }
                    }
                }
            }
        }
    },

    add_dynamic_world_to_static_teleport_menu: function(dynamic_world) {
        this.world_home.player_menu.add_personal_teleport_button(dynamic_world);
        this.world_settings.player_menu.add_personal_teleport_button(dynamic_world);
        this.world_admin.player_menu.add_personal_teleport_button(dynamic_world);
    },

    update_or_add_dynamic_world_to_all_other_dynamic_worlds_teleport_menu: function(dynamic_world) {
        let world_relative_id = (dynamic_world.entity.get_relative_id()).toString();

        // Update all dynamic worlds with the new teleport name.
        for (let relative_id in this.dynamic_worlds) {
            if (this.dynamic_worlds.hasOwnProperty(relative_id)) {
                if (world_relative_id !== relative_id) {

                    this.dynamic_worlds[relative_id].player_menu.update_or_add_personal_teleport_button(dynamic_world);
                }
            }
        }
    },

    add_dynamic_world: function(dynamic_world) {
        this.dynamic_worlds[dynamic_world.entity.get_relative_id()] = dynamic_world;
        this.add_dynamic_world_to_static_teleport_menu(dynamic_world);
    },

    _create_new_dynamic_world: function() {
        // Create a new created world Entity.
        let dynamic_world_entity = new Entity();
        dynamic_world_entity.set_property(ENTITY_DEFAULT_PROPERTY_TYPE, ENTITY_TYPE_DYNAMIC_WORLD);

        this.dynamic_worlds_manager_entity.add_child(dynamic_world_entity);

        let dynamic_world = new DynamicWorld(dynamic_world_entity);
        dynamic_world.create();
        this.set_current_world(dynamic_world);
        this.add_dynamic_world(dynamic_world);

        this.update_or_add_dynamic_world_to_all_other_dynamic_worlds_teleport_menu(dynamic_world);

        // Add all other dynamic worlds as a teleport button for this dynamic world.
        let relative_id = dynamic_world_entity.get_relative_id().toString();
        for (let other_relative_id in this.dynamic_worlds) {
            if (this.dynamic_worlds.hasOwnProperty(other_relative_id)) {
                if (other_relative_id !== relative_id) {
                    dynamic_world.player_menu.update_or_add_personal_teleport_button(this.dynamic_worlds[other_relative_id]);
                }
            }
        }
    },

    create_new_dynamic_world: function() {
        MANAGER_WORLD._create_new_dynamic_world();
    }

};


