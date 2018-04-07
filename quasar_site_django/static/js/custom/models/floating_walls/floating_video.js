'use strict';

function VidoeCSSElement(base_wall, video_source) {
    this.__init__(base_wall, video_source);
}

VidoeCSSElement.prototype = {
    __init__: function(base_wall, video_source) {
        // Base code from : https://codepen.io/asjas/pen/pWawPm
        var w = (base_wall.width * .9).toString() + 'px';
        var h = (base_wall.height * .9).toString() + 'px';
        var p = base_wall.get_position();
        var nn = base_wall.get_normal();
        var n = new THREE.Vector3(nn.x + p.x, nn.y + p.y, nn.z + p.z);

        this.div = document.createElement('div');
        this.div.style.width = w;
        this.div.style.height = h;
        this.div.style.backgroundColor = '#ff009b';

        this.iframe = document.createElement('iframe');

        this.iframe.style.width = w;
        this.iframe.style.height = h;
        this.iframe.style.border = '0px';
        this.iframe.src = ['https://www.youtube.com/embed/', video_source, '?rel=0'].join( '' );
        this.div.appendChild(this.iframe);

        this.object = new THREE.CSS3DObject(this.div);
        this.object.position.set(p.x, p.y, p.z);
        this.object.lookAt(n);

        base_wall.world.add_video_to_css_group(this.object);
        //base_wall.world.css_scene.add(this.object);
    },

    set_position_and_normal: function(position, normal) {
        var p = position;
        var nn = normal;
        var n = new THREE.Vector3(nn.x + p.x, nn.y + p.y, nn.z + p.z);
        this.object.position.set(p.x, p.y, p.z);
        this.object.lookAt(n);
    },

    update_width_and_height: function(width, height) {
        // TODO : INVESTIGATE WHY THIS HAPPENS!
        if (height < 0) {
            height *= -1;
        }

        var w = (width).toString() + 'px';
        var h = (height).toString() + 'px';

        this.div.style.width = w;
        this.div.style.height = h;

        this.iframe.style.width = w;
        this.iframe.style.height = h;
    }
};

function FloatingVideo(world, entity) {
    this.__init__(world, entity);
}

FloatingVideo.prototype = {

    __init__: function(world, entity) {
        if (!is_defined(entity)) {
            this.create_new_floating_video(world);
        } else {
            this.load_floating_video(world, entity);
        }

        this.add_base_wall_functionality();

        this.base_wall.world.root_attachables.push(this.base_wall);
        this.base_wall.refresh_position_and_look_at();
    },

    update_position_for_video: function() {
        this.video.set_position_and_normal(this.base_wall.get_position(), this.base_wall.get_normal());
    },

    update_dimensions_for_video: function() {
        this.video.update_width_and_height(this.base_wall.width * .9, this.base_wall.height * .9);
    },

    /*___  __    ___
     |__  |  \ |  |     |  |  /\  |    |
     |___ |__/ |  |     |/\| /~~\ |___ |___ */
    show_settings_wall: function() {
        this.settings_wall.force_display_self_and_all_child_attachments_recursively();
    },

    set_video: function() {
        var video_code = this.video_code_input.get_text();
        this.video_entity.set_property(ENTITY_PROPERTY_NAME, video_code);

        this.settings_wall.force_hide_self_and_all_child_attachments_recursively();
    },

    delete_video: function() {
        l('TODO : DELETE THIS VIDEO!');
        // TODO : Delete this video
    },

    /*        ___                 __   __   ___      ___         __                __           __        __          __
     | |\ | |  |  |  /\  |       /  ` |__) |__   /\   |  | |\ | / _`     /\  |\ | |  \    |    /  \  /\  |  \ | |\ | / _`
     | | \| |  |  | /~~\ |___    \__, |  \ |___ /~~\  |  | | \| \__>    /~~\ | \| |__/    |___ \__/ /~~\ |__/ | | \| \__> */
    add_base_wall_functionality: function() {
        // Create the settings wall.
        this.settings_wall = this.base_wall.add_floating_wall_attachment(400, 400, null, [25, HALF], 10, false);
        //this.settings_wall.add_close_button();
        this.settings_wall.set_auto_adjust_height(true);
        this.settings_wall.manual_visibility = true;

        var settings_row = this.settings_wall.add_row();
        settings_row.add_text_2D([0, ONE_THIRD, false], 16, 'Video Code:');
        this.video_code_input = settings_row.add_input_2D([ONE_THIRD, 1, false], 16, '');

        settings_row = this.settings_wall.add_row();
        settings_row.add_button([0, 1, false], 16, 'set video', this.set_video.bind(this));

        settings_row = this.settings_wall.add_row();
        settings_row.add_button([0, 1, false], 16, 'delete video', this.delete_video.bind(this));

        this.settings_wall.force_hide_self_and_all_child_attachments_recursively();

        // Create the settings button.
        var row = this.base_wall.add_row(-1);
        var icon_width = 16 / this.base_wall.width;

        var settings_button = row.add_icon_button([0, icon_width, true], ICON_SETTINGS, this.show_settings_wall.bind(this));

        // Create the delete button.
        //var close_button = row.add_icon([icon_width, icon_width * 2, true], ICON_CROSS);
        //this.base_wall.world.interactive_objects.push(close_button);
        //close_button.engable = false;
        // TODO : close_button.set_engage_function()
    },

    create_new_floating_video: function(world) {
        var data = get_player_blink_spot(200);

        this.base_wall = new FloatingWall(400, 300, data[0], data[1], world, true);
        this.base_wall.set_to_saveable(world.entity);

        this.video_entity = new Entity();
        this.video_entity.set_property(ENTITY_DEFAULT_PROPERTY_TYPE, ENTITY_TYPE_VIDEO);
        this.video_entity.add_parent(this.base_wall.get_self_entity());
    },

    load_floating_video: function(world, entity) {
        this.video_entity = entity;

        // Load the base wall.
        this.base_wall = new FloatingWall(400, 600, null, null, world, true);
        this.base_wall.load_from_entity_data(this.video_entity.get_parent());

        this.video = new VidoeCSSElement(this.base_wall, this.video_entity.get_value(ENTITY_PROPERTY_NAME));
        this.base_wall.post_position_update = this.update_position_for_video.bind(this);
        this.base_wall.post_update_dimensions = this.update_dimensions_for_video.bind(this);
    }
};
