LoginWorld.prototype = {

    custom_world_enter: function() {
        if (CURRENT_CLIENT.get_cookie(COOKIE_SHOULD_REMEMBER_USERNAME)) {
            this.remember_username.set_checked_state(true);
            if (CURRENT_CLIENT.has_cookie(COOKIE_REMEMBERED_USERNAME)) {
                this.input_username_login.update_text(CURRENT_CLIENT.get_cookie(COOKIE_REMEMBERED_USERNAME));
            }
        }
    },

    custom_world_exit: function() {
        //this.login_wall.clear_inputs();
        //this.wall_create_account.clear_inputs();
    },

    /*     __   __                  __  ___    __
     |    /  \ / _` | |\ |     /\  /  `  |  | /  \ |\ |
     |___ \__/ \__> | | \|    /~~\ \__,  |  | \__/ | \| */
    login_button_pressed: function() {
        this.server_request_login.set_username(this.input_username_login.get_text());
        this.server_request_login.set_password(this.input_password_login.get_text());
        this.server_request_login.perform_request();
    },

    login_success: function() {
        if (this.remember_username.is_checked()) {
            CURRENT_CLIENT.set_cookie(COOKIE_REMEMBERED_USERNAME, this.input_username_login.get_text());
        }
    },

    /*__   __   ___      ___  ___          __   __   __            ___          __  ___    __
     /  ` |__) |__   /\   |  |__      /\  /  ` /  ` /  \ |  | |\ |  |      /\  /  `  |  | /  \ |\ |
     \__, |  \ |___ /~~\  |  |___    /~~\ \__, \__, \__/ \__/ | \|  |     /~~\ \__,  |  | \__/ | \| */
    create_account_button_pressed: function() {
        this.server_request_create_account.set_username(this.input_username_create.get_text());
        this.server_request_create_account.set_password(this.input_password_create.get_text());
        this.server_request_create_account.set_email(this.input_email_create.get_text());
        this.server_request_create_account.perform_request();
    },

    create_account_success: function() {
        this.server_request_login.set_username(this.input_username_create.get_text());
        this.server_request_login.set_password(this.input_password_create.get_text());
        this.server_request_login.perform_request();
    },

    /*__   ___        ___        __   ___  __           __   ___  __                   ___     __   __   ___  __   __   ___  __
     |__) |__   |\/| |__   |\/| |__) |__  |__)    |  | /__` |__  |__) |\ |  /\   |\/| |__     |__) |__) |__  /__` /__` |__  |  \
     |  \ |___  |  | |___  |  | |__) |___ |  \    \__/ .__/ |___ |  \ | \| /~~\  |  | |___    |    |  \ |___ .__/ .__/ |___ |__/ */
    remember_username_pressed: function(is_checked) {
        CURRENT_CLIENT.set_cookie(COOKIE_SHOULD_REMEMBER_USERNAME, is_checked);
    },

    /*        ___                      __        __
     | |\ | |  |  |  /\  |       |    /  \  /\  |  \
     | | \| |  |  | /~~\ |___    |___ \__/ /~~\ |__/ */
    create: function() {
        this._create_login_wall();
        this._create_create_account_wall();
        this._create_server_requests();

        // Test.
        //this.keyboard = new KeyboardModel(this);
        this.keyboard = new MANAGER_MANAGER.KeyboardModel();
        this.keyboard.__init__(this);
        this.keyboard.create();
        this.keyboard.set_position(1200, 300, 800);
        this.keyboard.look_at_origin();
        this.keyboard.refresh_position_and_look_at();
    },

    _create_server_requests: function() {
        this.server_request_login = new ServerRequestLogin();
        this.server_request_login.bind_to_button(this.button_login);
        this.server_request_login.bind_success_event(this.login_success.bind(this));

        this.server_request_create_account = new ServerRequestCreateAccount();
        this.server_request_create_account.bind_to_button(this.button_create_account);
        this.server_request_create_account.bind_success_event(this.create_account_success.bind(this));
    },

    _create_create_account_wall: function() {
        // Repeat Password.
        row = this.wall_create_account.add_row();
        this.input_repeat_password_create = row.add_input_2D([0, 1], 16, null, null, null, true);
        this.input_repeat_password_create.add_syntax(TEXT_SYNTAX_REPEAT_PASSWORD);
        this.input_repeat_password_create.add_label_left('repeat password:');

        // Create account button.
        row = this.wall_create_account.add_row();
        this.button_create_account = row.add_button([ONE_FOURTH, THREE_FOURTHS, true], 16, 'create account', this.create_account_button_pressed.bind(this));

        // Connect the elements together as a form.
        this.form_create_account = new FormManager([this.input_username_create, this.input_email_create, this.input_password_create, this.input_repeat_password_create], this.button_create_account);
    },

    _create_login_wall: function() {
        this.wall_login = new FakeFloatingWall(200, 95, login_wall_position, login_wall_normal, this);

        // Title.
        let row = this.wall_login.add_row(-1);
        row.add_text_3D([HALF, null, true], 32, 'Login', true);

        // Username.
        row = this.wall_login.add_row();
        this.input_username_login = row.add_input_2D([0, 1], 16, null, null, null, true);
        this.input_username_login.add_syntax(TEXT_SYNTAX_USERNAME);
        this.input_username_login.add_label_left('username:', true, true);

        // Login button.
        row = this.wall_login.add_row();
        this.button_login = row.add_button([ONE_FOURTH, THREE_FOURTHS, true], 16, 'login', this.login_button_pressed.bind(this));

        // Connect the elements together as a form.
        this.form_login = new FormManager([this.input_username_login, this.input_password_login], this.button_login);
    }

};