'use strict';

function EntityWall(world, entity) {
    this.__init__(world, entity);
}

EntityWall.prototype = {

    __init__: function(world, entity) {
        this.entity_wall_needs_to_load_entities = false;

        if (!is_defined(entity)) {
            /*__   __   ___      ___         __           ___          ___      ___   ___
             /  ` |__) |__   /\   |  | |\ | / _`    |\ | |__  |  |    |__  |\ |  |  |  |  \ /    |  |  /\  |    |
             \__, |  \ |___ /~~\  |  | | \| \__>    | \| |___ |/\|    |___ | \|  |  |  |   |     |/\| /~~\ |___ |___ */
            var pp = CURRENT_PLAYER.get_position();
            var pn = CURRENT_PLAYER.get_direction();
            var p = new THREE.Vector3(pp.x + pn.x * 200, pp.y + pn.y * 200, pp.z + pn.z * 200);
            var n = new THREE.Vector3(-pn.x, 0, -pn.z);

            this.base_wall = new FloatingWall(400, 600, p, n, world, true);
            this.base_wall.add_full_row_3D(-1, 'Entity Wall', TYPE_INPUT);

            this.base_wall.set_to_saveable();
        } else {
            /*     __        __          __      ___      ___   ___
             |    /  \  /\  |  \ | |\ | / _`    |__  |\ |  |  |  |  \ /    |  |  /\  |    |
             |___ \__/ /~~\ |__/ | | \| \__>    |___ | \|  |  |  |   |     |/\| /~~\ |___ |___ */
            this.entity_wall_entity = entity;

            // Load the base wall.
            this.base_wall = new FloatingWall(400, 600, null, null, world, true);
            this.base_wall.load_from_entity_data(MANAGER_ENTITY.get_entity_by_id(entity.get_parent_ids()[0]));
            this.base_wall.refresh_position_and_look_at();

            this.entity_wall_needs_to_load_entities = true;
        }

        // Create the standard functionality of the entity wall.
        this.create_new_entity_button = this.base_wall.add_row(0).add_2D_button([0, 1], 'create new entity', COLOR_GREEN, null);


        // TODO : Create a button for deleting the entity wall!!


        // Regardless if created or loaded the following operations must be taken.
        // TODO : This should be automatic? Remove the need to explicitly need to write this code.
        this.base_wall.world.root_attachables.push(this.base_wall);
        this.base_wall.refresh_position_and_look_at();
        this._create_entity_wall();

        // Wall used for creating new entities and editing existing entities.
        this.wall_entity_editor = new EntityEditor(this);
        this.wall_entity_editor.set_create_entity_display_button(this.create_new_entity_button);

        this.base_wall.refresh_position_and_look_at();
    },

    _create_entity_wall: function() {
        this.entity_wall = this.base_wall.add_floating_wall_attachment(this.base_wall.width * .8, this.base_wall.height * .8, 0, 0, 5, false);
        this.entity_wall.set_background_color(COLOR_BLACK, true);

        if (this.entity_wall_needs_to_load_entities) {
            // The entity wall is being loaded.
            var number_of_children = this.entity_wall_entity.number_of_children();
            for (var e = 0; e < number_of_children; e++) {
                this.add_entity(this.entity_wall_entity.children[e]);
            }
        } else {
            // The entity wall is being created for the first time.
            this.entity_wall.set_to_saveable();
            this.entity_wall_entity = this.entity_wall._entity;
            this.entity_wall._entity.set_property(ENTITY_DEFAULT_PROPERTY_TYPE, ENTITY_TYPE_ENTITY_WALL);
            this.entity_wall._entity.add_parent(this.base_wall._entity);
        }

        //this.entity_wall = new FloatingWall(this.base_wall.width * .8, this.base_wall.height * .8, null, null, this.base_wall.normal, false, COLOR_BLACK);
        //this.entity_wall.attach_to(this.base_wall);
        //this.entity_wall.set_attachment_depth_offset(5);
    },

    _edit_entity: function(entity, entity_button) {
        this.wall_entity_editor.edit_entity(entity, entity_button);
    },

    add_entity: function (entity) {
        var entity_name = entity.get_value(ENTITY_PROPERTY_NAME);
        var entity_relative_id = entity.get_relative_id();
        var entity_button = this.entity_wall.add_row(null, entity_relative_id).add_2D_button([0, 1], entity_name, COLOR_YELLOW, null);
        entity_button.set_engage_function(this._edit_entity.bind(this, entity, entity_button));

        this.base_wall.refresh_position_and_look_at();
    },

    delete_entity: function(entity) {
        var entity_name = entity.get_value(ENTITY_PROPERTY_NAME);
        var entity_relative_id = entity.get_relative_id();
        this.entity_wall.delete_row_by_name(entity_relative_id);
        MANAGER_ENTITY.delete_entity_by_id(entity_relative_id);

        this.base_wall.refresh_position_and_look_at();
    }

};