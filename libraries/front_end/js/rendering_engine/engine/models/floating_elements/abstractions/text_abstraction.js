'use strict';

$_QE.prototype.TextAbstraction = function(text) {

    this.syntax_rules = [];

    this.bold = false;

    this.text         = text;
    this.text_changed = false;

    this._is_password = false;

    /*__           ___              __   __   ___  __       ___    __        __
     /__` \ / |\ |  |   /\  \_/    /  \ |__) |__  |__)  /\   |  | /  \ |\ | /__`
     .__/  |  | \|  |  /~~\ / \    \__/ |    |___ |  \ /~~\  |  | \__/ | \| .__/ */
    this.add_syntax = function(text_syntax) {
        switch (text_syntax) {
        case TEXT_SYNTAX_PASSWORD:
            this._is_password = true;
            this.syntax_rules.push(new $_QE.prototype.TextSyntaxPassword());
            break;
        case TEXT_SYNTAX_USERNAME:
            this.syntax_rules.push(new $_QE.prototype.TextSyntaxUsername());
            break;
        case TEXT_SYNTAX_EMAIL:
            this.syntax_rules.push(new $_QE.prototype.TextSyntaxEmail());
            break;
        case TEXT_SYNTAX_REPEAT_PASSWORD:
            this._is_password = true;
            this.syntax_rules.push(new $_QE.prototype.TextSyntaxRepeatPassword());
            break;
        }
    };

    this.has_syntax = function(syntax) {
        for (let sr = 0; sr < this.syntax_rules.length; sr++) {
            if (this.syntax_rules[sr].text_syntax_type === syntax) {
                return true;
            }
        }
        return false;
    };

    this.syntax_check = function(additional_arguments) {
        for (let sr = 0; sr < this.syntax_rules.length; sr++) {

            let results = this.syntax_rules[sr].does_text_pass_requirements(this.text, additional_arguments);

            if (!results[0]) {
                return [false, results[1]];
            }
        }
        return [true, null];
    };
    /*___  ___     ___     __   __   ___  __       ___    __        __
       |  |__  \_/  |     /  \ |__) |__  |__)  /\   |  | /  \ |\ | /__`
       |  |___ / \  |     \__/ |    |___ |  \ /~~\  |  | \__/ | \| .__/ */
    this.update_text = function(text) {
        if (this.get_text() !== text) {
            if (is_defined(this.value_pre_changed_function)) {
                this.value_pre_changed_function(text);
            }
            this.text = text;
            if (is_defined(this.value_post_changed_function)) {
                this.value_post_changed_function(text);
            }
            this.text_changed = true;
            this.refresh();
        }
    };

    this.clear = function() {
        this.update_text('');
    };

    this._add_character = function(character) {
        this.update_text(this.get_text() + character);
    };

    this._pop_character = function() {
        let t = this.get_text();
        this.update_text(t.slice(0, -1));
    };

    this.parse_text = function(text) {
        let i;
        for (i = 0; i < text.length; i++) {
            this._add_character(text.charAt(i));
        }
    };

    this.parse_keycode = function(event) {
        let keycode = event.keyCode;

        if (keycode === KEY_CODE__DELETE) {
            if (this.get_text().length > 0) {
                this._pop_character();
                MANAGER_AUDIO.play_typing_sound();
            }
        } else if (event.key.length === 1) {
            this._add_character(event.key);
            MANAGER_AUDIO.play_typing_sound();
        }
    };

    this.mobile_add_character = function(key) {
        this._add_character(key);
        MANAGER_AUDIO.play_typing_sound();
    };

    this.mobile_delete_character = function() {
        if (this.get_text().length > 0) {
            this._pop_character();
            MANAGER_AUDIO.play_typing_sound();
        }
    };

    /*__   ___ ___ ___  ___  __   __
     / _` |__   |   |  |__  |__) /__`
     \__> |___  |   |  |___ |  \ .__/ */
    this.get_text_as_value = function() {
        return parseInt(this.get_text());
    };

    this.get_text = function() {
        return this.text;
    };

    this.get_display_text = function() {
        if (this._is_password) {
            let t = '';
            for (let c = 0; c < this.text.length; c++) {
                t += '*';
            }
            return t;
        }
        return this.text;
    };
};