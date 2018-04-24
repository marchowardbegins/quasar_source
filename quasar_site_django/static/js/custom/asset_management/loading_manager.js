'use strict';

// Needed for the file loader to work (for shaders). TODO : Add better documentation.
THREE.Cache.enabled = true;

ManagerManager.prototype.get_loading_manager = function() {
    function LoadingManager() {
        this.__init__();
    }
    LoadingManager.prototype = {
        __init__: function() {
            this._number_of_resources_to_load   = 0;
            this._number_of_resources_loaded    = 0;
            this._number_of_asset_groups_loaded = 0;

            this.asset_groups = [];

            // All the asset groups to load.
            this.textures_cursor      = new TextureGroup(TEXTURE_GROUP_CURSOR    , this, this.check_if_initial_resources_loaded.bind(this));
            this.textures_skybox      = new TextureGroup(TEXTURE_GROUP_SKYBOX    , this, this.check_if_initial_resources_loaded.bind(this));
            this.textures_icon        = new TextureGroup(TEXTURE_GROUP_ICONS     , this, this.check_if_initial_resources_loaded.bind(this));
            this.textures_transitions = new TextureGroup(TEXTURE_GROUP_TRANSITION, this, this.check_if_initial_resources_loaded.bind(this));

            this.all_audio            = new AudioGroup(this, this.check_if_initial_resources_loaded.bind(this));

            this.all_shaders          = new ShaderGroup(this, this.check_if_initial_resources_loaded.bind(this));

            //this.spritesheet          = new SpriteSheetGroup(this, this.check_if_initial_resources_loaded.bind(this));
            this._group_json          = new JSONGroup(this, this.check_if_initial_resources_loaded.bind(this));
        },

        asset_loaded: function(asset) {
            this._number_of_resources_loaded += 1;
            let text = int((this._number_of_resources_loaded / this._number_of_resources_to_load) * 100.0) + '%';
            let sub_text = 'loaded : ' + asset;
            GUI_PAUSED_MENU.set_text(text);
            GUI_PAUSED_MENU.set_sub_text(sub_text);
        },

        /*__             __        __              ___                      __        __          __
         /  \ |  |  /\  /__`  /\  |__)    | |\ | |  |  |  /\  |       |    /  \  /\  |  \ | |\ | / _`
         \__X \__/ /~~\ .__/ /~~\ |  \    | | \| |  |  | /~~\ |___    |___ \__/ /~~\ |__/ | | \| \__> */
        perform_initial_load: function(quasar_main_loop) {
            this.quasar_main_loop = quasar_main_loop;

            let asset_group;
            for (asset_group = 0; asset_group < this.asset_groups.length; asset_group++) {
                this.asset_groups[asset_group].load_assets();
            }
        },

        check_if_initial_resources_loaded: function() {
            if (this._number_of_asset_groups_loaded === this.asset_groups.length) {
                this.quasar_main_loop.asset_loading_completed();
            }
        },

        currently_loading: function() {
            return this._number_of_resources_loaded !== this._number_of_resources_to_load;
        }
    };

    this.manager_loading = new LoadingManager();
    return this.manager_loading;
};