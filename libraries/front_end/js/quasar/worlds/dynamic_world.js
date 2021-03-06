DynamicWorld.prototype = {

    __init__: function(dynamic_world_entity) {
        // Inherit.
        World.call(this, dynamic_world_entity);
        WorldInput.call(this);
        WorldState.call(this, new THREE.Vector3(0, 100, 0));
        WorldDynamicContent.call(this);

        if (this.entity.has_property(ENTITY_PROPERTY_NAME)) {
            this.world_name = this.entity.get_value(ENTITY_PROPERTY_NAME);
        } else {
            this.world_name = 'New World';
        }

        this.world_name_changed = false;
    },

    button_action_set_to_private: function() {

    },

    button_action_share_with_player: function() {

    },

    world_name_changed_from_input_event: function(name_currently) {
        this.world_name_changed = true;
        this.world_name_changed_event(name_currently);

        MANAGER_WORLD.update_world_name_for_teleport_buttons(this);
    },

    world_name_changed_event: function(name_currently) {
        this.world_name_input.update_text(name_currently);
        this.world_title.update_text(name_currently);
        this.world_name = name_currently;
    },

    create: function() {
        // Add the world label and settings panel.
        let world_wall_width = 400;
        let world_wall_height = 300;

        let world_wall_position = new THREE.Vector3(500, 500, 500);
        let world_wall_normal = new THREE.Vector3(-500, 0, -500);

        this.world_wall = new FloatingWall(world_wall_width, world_wall_height, world_wall_position, world_wall_normal, this, false);
        this.world_wall.set_auto_adjust_height(true);
        this.world_title = this.world_wall.add_row(-1).add_text_3D([0, null, false], 32, this.world_name);

        let current_row = this.world_wall.add_row(null);
        current_row.add_text_2D([0, ONE_THIRD, false], 16, 'World Name :');
        this.world_name_input = current_row.add_input_2D([ONE_THIRD, 1, false], 16, this.world_name);
        this.world_name_input.set_value_post_changed_function(this.world_name_changed_from_input_event.bind(this));

        // Adding a row for spacing.
        this.world_wall.add_row(null);

        current_row = this.world_wall.add_row(null);
        // TODO : This functionality.
        current_row.add_button([0, 1, false], 16, 'Set World To Private', null);
        current_row.add_button([0, 1, false], 16, 'Set World To Private', null);

        current_row = this.world_wall.add_row(null);
        // TODO : This functionality.
        current_row.add_button([0, 1, false], 16, 'Share With Player', null);


        this.world_wall.refresh_position_and_look_at();
    }

};
