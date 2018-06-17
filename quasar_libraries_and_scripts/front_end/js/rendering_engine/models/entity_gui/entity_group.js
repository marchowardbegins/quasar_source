'use strict';

function EntityGroup(world, entity) {
    this.__init__(world, entity);
}

EntityGroup.prototype = {

    __init__: function(world, entity) {
        // Subscribe to entity notification events.
        EntityChangesSubscriber.call(this, world, true, false);
        this.add_to_subscribers_list();

        this.initialize(world, entity);
    },

    _edit_entity: function(entity_relative_id, entity_button) {
        this.wall_entity_editor.edit_entity(entity_relative_id, entity_button);
    },

    /*___      ___   ___         ___       ___      ___  __                     __               __  
     |__  |\ |  |  |  |  \ /    |__  \  / |__  |\ |  |  /__`    |__|  /\  |\ | |  \ |    | |\ | / _` 
     |___ | \|  |  |  |   |     |___  \/  |___ | \|  |  .__/    |  | /~~\ | \| |__/ |___ | | \| \__> */
    on_entity_added: function(entity) {
        // TODO : Move the logic of this line?
        //entity.set_property(ENTITY_PROPERTY_GROUP_NAME, this.entity_wall_title.get_text());

        let entity_name = entity.get_value(ENTITY_PROPERTY_NAME);
        let entity_relative_id = entity.get_relative_id();

        let row = this.entity_wall.add_row(null, entity_relative_id);
        let entity_button = row.add_button([0, 1, true], 16, entity_name, null);
        entity_button.set_button_engage_function(this._edit_entity.bind(this, entity_relative_id, entity_button));

        // Entities that get added to an EntityGroup must set the EntityGroupEntity as its parent.
        entity.add_parent(this.entity_group_entity);
        entity.user_created = true;

        this.base_wall.refresh_position_and_look_at();
    },

    on_entity_deleted: function(entity) {
        //l('ON ENTITY DELETED CALLED!!!');
        this.entity_wall.delete_row_by_name(entity.get_relative_id());
        this.base_wall.refresh_position_and_look_at();
    },

    /*        ___                 __   __   ___      ___         __                __           __        __          __
     | |\ | |  |  |  /\  |       /  ` |__) |__   /\   |  | |\ | / _`     /\  |\ | |  \    |    /  \  /\  |  \ | |\ | / _`
     | | \| |  |  | /~~\ |___    \__, |  \ |___ /~~\  |  | | \| \__>    /~~\ | \| |__/    |___ \__/ /~~\ |__/ | | \| \__> */
    initialize: function(world, entity) {
        let was_loaded = false;

        if (!is_defined(entity)) {
            this.create_new(world);
        } else {
            was_loaded = true;
            this.load_from_entity(world, entity);
        }
        this.base_wall_init_start();

        if (!was_loaded) {
            this.create_new_finalize();
        } else {
            this.load_from_entity_finalize();
        }

        this.wall_entity_editor = new EntityEditor(this, this.base_wall);
        this.wall_entity_editor.set_create_entity_display_button(this.create_new_entity_button);

        // Create base wall delete button.
        this._create_delete_button();

        this.base_wall.refresh_position_and_look_at();
    },

    create_new: function(world) {
        let data = get_player_blink_spot(1000);

        this.base_wall = new FloatingWall(400, 600, data[0], data[1], world, true);
        this.base_wall.set_to_manual_positioning();
        let row = this.base_wall.add_row(-1);
        this.entity_wall_title = row.add_input_3D([0, 1, false], 32, 'Entity Group');

        this.base_wall.set_to_saveable(world.entity);
    },

    load_from_entity: function(world, entity) {
        this.entity_group_entity = entity;

        this.base_wall = new FloatingWall(400, 600, null, null, world, true);
        this.base_wall.set_to_manual_positioning();
        this.base_wall.load_from_entity_data(this.entity_group_entity.get_parent());

        this.entity_wall_title = this.base_wall.get_row_with_index(-1).elements[0];
    },

    base_wall_init_start: function() {
        // Create the standard functionality of the entity wall.
        let row = this.base_wall.add_row(0);
        this.create_new_entity_button = row.add_button([0, 1, false], 16, 'create new entity', null, COLOR_GREEN);

        this.base_wall.world.root_attachables.push(this.base_wall);

        this.entity_wall = this.base_wall.add_floating_wall_attachment(this.base_wall.width * .8, this.base_wall.height * .8, 0, 0, 5, false);
        this.entity_wall.set_background_color(COLOR_BLACK, true);
    },

    create_new_finalize: function() {
        this.entity_wall.set_to_saveable();
        this.entity_group_entity = this.entity_wall.get_self_entity();
        this.entity_group_entity.set_property(ENTITY_DEFAULT_PROPERTY_TYPE, ENTITY_TYPE_ENTITY_GROUP);
        this.entity_group_entity.add_parent(this.base_wall.get_self_entity());
    },

    load_from_entity_finalize: function() {
        let number_of_children = this.entity_group_entity.number_of_children();
        for (let e = 0; e < number_of_children; e++) {
            this.entity_group_entity.children[e].user_created = true;
            this.entity_added(this.entity_group_entity.children[e]);
        }
    },

    _create_delete_button: function() {
        this.delete_confirmation = new ConfirmationPrompt(this.base_wall.world);
        this.delete_confirmation.bind_confirmation_prompt(this._get_confirmation_prompt.bind(this));
        this.delete_confirmation.bind_yes_action(this._delete_entity_group.bind(this));
        this.button_delete_entity_group = new FloatingButton(this.base_wall.world, this.base_wall.width, 16, 'delete entity group', null);
        this.button_delete_entity_group.set_default_foreground_color(COLOR_RED);
        this.button_delete_entity_group.set_current_foreground_color(COLOR_RED, true);
        this.base_wall.add_attachment_to_bottom(this.button_delete_entity_group);
        this.delete_confirmation.set_button(this.button_delete_entity_group);
    },

    _get_confirmation_prompt: function() {
        return 'Delete Entity Group{' + this.entity_wall_title.get_text() + '}?';
    },

    _delete_entity_group: function() {
        l('Delete entity group!!');

    }
};