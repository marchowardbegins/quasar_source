'use strict'

// TODO : All the 2d gui work should be abstracted
// TODO : research the efficiency of updating html text elements

function PausedMenu() {
    this.__init__()
}

PausedMenu.prototype = {

    pause_menu: null,
    background_coloring: null,

    button_resume: null,
    button_settings: null,
    button_help_controls: null,
    button_log_out: null,

    __init__: function() {
        this.background_coloring  = document.getElementById('background_coloring')
        this.pause_menu           = document.getElementById('pause_menu')
        this.button_resume        = document.getElementById('button_resume')
        this.button_settings      = document.getElementById('button_settings')
        this.button_help_controls = document.getElementById('button_help_controls')
        this.button_log_out       = document.getElementById('button_log_out')

        this.button_resume.onclick = function() {
            this.make_invisible()
            this.player.pointer_lock_api.try_to_enable()
        }.bind(this)

        this.button_settings.onclick = function() {

        }.bind(this)

        this.button_help_controls.onclick = function() {

        }.bind(this)

        this.button_log_out.onclick = function() {
            this.player.log_out()
        }.bind(this)
    },

    provide_player_object: function(player_object) {
        this.player = player_object
    },

    make_visible: function() {
        this.pause_menu.style.visibility = 'visible'
        this.button_resume.style.visibility = 'visible'
        this.button_help_controls.style.visibility = 'visible'
        if (this.player.logged_in) {
            this.button_settings.style.visibility = 'visible'
            this.button_log_out.style.visibility = 'visible'
        }

        this.background_coloring.id = 'background_coloring'
    },

    make_invisible: function() {
        this.pause_menu.style.visibility = 'hidden'

        this.background_coloring.id = 'no_background_coloring'
    }
}

var PAUSED_MENU = new PausedMenu()
