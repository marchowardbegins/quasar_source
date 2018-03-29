'use strict';

function LoginWorld() {
    this.__init__();
}

LoginWorld.prototype = {


    __init__: function() {
        // Inherit.
        World.call(this);
        WorldState.call(this, new THREE.Vector3(0, 200, 0), new THREE.Vector3(400, 200, 430), this.custom_world_enter.bind(this), this.custom_world_exit.bind(this));
        WorldInput.call(this);
    },

    custom_world_enter: function() {
        this.quasar_source_title.refresh_position_and_look_at();
        this.wall_login.refresh_position_and_look_at();


        //this.temp_input.refresh();
        //this.temp_input.refresh_position_and_look_at();

        //this.wall_create_account.refresh_position_and_look_at();
    },

    custom_world_exit: function() {
        //this.login_wall.clear_inputs();
        //this.wall_create_account.clear_inputs();
    },

    /*        ___                      __        __
     | |\ | |  |  |  /\  |       |    /  \  /\  |  \
     | | \| |  |  | /~~\ |___    |___ \__/ /~~\ |__/ */
    create: function() {
        this._create_quasar_title();
        this._create_login_wall();

        /*     __   __
         |    /  \ / _` | |\ |    |  |  /\  |    |
         |___ \__/ \__> | | \|    |/\| /~~\ |___ |___ */



        // OLD CODE BELOW
        // OLD CODE BELOW
        // OLD CODE BELOW
        //this.login_errors = new TextSyntaxManager(this);

        /*

        var login_username_row = this.wall_login.add_row(0).add_2D_label_and_input(ONE_THIRD, 'username', [TEXT_SYNTAX_STANDARD_LENGTH]);
        this.login_username_input = login_username_row[1];
        //this.login_errors.add_label_and_input(login_username_row[0], login_username_row[1]);
        //this.login_username_input.set_value_post_changed_function(this._error_check.bind(this, this.login_errors));

        var login_password_row = this.wall_login.add_row(1).add_2D_label_and_input(ONE_THIRD, 'password', [TEXT_SYNTAX_STANDARD_LENGTH]);
        login_password_row[1].set_type(TYPE_PASSWORD);
        this.login_password_input = login_password_row[1];
        //this.login_errors.add_label_and_input(login_password_row[0], login_password_row[1]);
        //this.login_password_input.set_value_post_changed_function(this._error_check.bind(this, this.login_errors));

        this.login_button = this.wall_login.add_row(3).add_2D_button([ONE_FOURTH, THREE_FOURTHS], 'login', null, this.login_button_pressed.bind(this));
        //this.login_errors.add_final_button(this.login_button);

        */
    },

    _create_quasar_title: function() {
        this.quasar_source_title = new FloatingText3D(this, 128, 'Quasar Source');
        this.quasar_source_title.set_position(1200, 200, 400);
        this.quasar_source_title.look_at_origin(false);
    },

    _create_login_wall: function() {
        var login_wall_position = new THREE.Vector3(600, 300, 350);
        var login_wall_normal = new THREE.Vector3(-login_wall_position.x, 0, -login_wall_position.z);
        this.wall_login = new FloatingWall(350, 95, login_wall_position, login_wall_normal, this);
        var row = this.wall_login.add_row(-1);
        row.add_text_3D(HALF, 32, 'Login', true);

        row = this.wall_login.add_row();
        var input_username = row.add_input_2D([0, 1], 16);
        input_username.add_label_left('username:');

        row = this.wall_login.add_row();
        var input_password = row.add_input_2D([0, 1], 16);
        input_password.add_syntax(TEXT_SYNTAX_PASSWORD);
        input_password.add_label_left('password:');

        row = this.wall_login.add_row();
        var remember_username = row.add_checkbox(0, 16, false);
        remember_username.add_label_left('remember username:');


        //

        this.wall_login.make_base_wall_invisible();
    }
};