'use strict';

/*     __        __          __                           __   ___  __
 |    /  \  /\  |  \ | |\ | / _`     |\/|  /\  |\ |  /\  / _` |__  |__)
 |___ \__/ /~~\ |__/ | | \| \__>     |  | /~~\ | \| /~~\ \__> |___ |  \ */
function LoadingManager() {
    this.__init__();
}

LoadingManager.prototype = {

    __init__: function() {
        this._number_of_resources_to_load = 0;
        this._number_of_resources_loaded  = 0;

        this.textures_cursor = new TextureGroup(TEXTURE_GROUP_CURSOR, this, this.check_if_initial_resources_loaded.bind(this));
        this.textures_skybox = new TextureGroup(TEXTURE_GROUP_SKYBOX, this, this.check_if_initial_resources_loaded.bind(this));
        this.textures_icon   = new TextureGroup(TEXTURE_GROUP_ICONS,  this, this.check_if_initial_resources_loaded.bind(this));

        this.all_audio       = new AudioGroup(this, this.check_if_initial_resources_loaded.bind(this));
    },

    asset_loaded: function(asset) {
        this._number_of_resources_loaded += 1;
        GUI_PAUSED_MENU.set_text(int((this._number_of_resources_loaded / this._number_of_resources_to_load) * 100.0) + '%');
        GUI_PAUSED_MENU.set_sub_text('loaded : ' + asset);
    },

    // TODO : Isn't this handled by the texture manager?
    get_texture: function(texture_group, texture_name) {
        switch (texture_group) {
        case TEXTURE_GROUP_CURSOR:
            return this.textures_cursor.get_texture(texture_name);
        case TEXTURE_GROUP_ICONS:
            return this.textures_icon.get_texture(texture_name);
        case TEXTURE_GROUP_SKYBOX:
            return this.textures_skybox.get_texture(texture_name);
        }
    },

    /*__             __        __              ___                      __        __          __
     /  \ |  |  /\  /__`  /\  |__)    | |\ | |  |  |  /\  |       |    /  \  /\  |  \ | |\ | / _`
     \__X \__/ /~~\ .__/ /~~\ |  \    | | \| |  |  | /~~\ |___    |___ \__/ /~~\ |__/ | | \| \__> */
    perform_initial_load: function(quasar_main_loop) {
        this.quasar_main_loop = quasar_main_loop;

        CURRENT_PLAYER.set_state(PLAYER_STATE_LOADING);

        this.textures_cursor.load_textures();
        this.textures_skybox.load_textures();
        this.textures_icon.load_textures();
        this.all_audio.load_audio_buffers();
    },

    initial_resources_loaded: function() {
        return this.textures_cursor._loaded && this.textures_icon._loaded && this.textures_skybox._loaded && this.all_audio._loaded;
    },

    check_if_initial_resources_loaded: function() {
        if (this.initial_resources_loaded()) {
            MANAGER_TEXTURE.create_skybox_material();

            MANAGER_WORLD.create_world(MANAGER_WORLD.world_login);
            MANAGER_WORLD.create_singletons();

            MANAGER_RENDERER.login_world_created();
            if (CURRENT_CLIENT.is_mobile) {
                MANAGER_INPUT.load_mobile_keyboard();
            }
            
            MANAGER_WEB_SOCKETS.connect();

            //if (CURRENT_CLIENT.is_mobile) {
            //    MANAGER_INPUT.create_mobile_buttons();
            //}

            MANAGER_WORLD.set_current_world(MANAGER_WORLD.world_login);

            // All the initial resources have loaded so put the player in a paused state in order to gain the first pointer lock control.
            CURRENT_PLAYER.set_state(PLAYER_STATE_PAUSED);

            this.quasar_main_loop.run();
        }
    },

    currently_loading: function() {
        return this._number_of_resources_loaded !== this._number_of_resources_to_load;
    }
};