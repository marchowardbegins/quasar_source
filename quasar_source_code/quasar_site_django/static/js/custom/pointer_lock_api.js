'use strict'

// https://www.html5rocks.com/en/tutorials/pointerlock/intro/

function PointerLockAPI(controls) {
    this.__init__(controls)
}

PointerLockAPI.prototype = {
    has_pointer_lock: null,
    element         : null,
    currently_locked: false,
    controls        : null,

    l_key_currently_down: false,

    __init__: function (controls) {
        this.controls = controls
        this.element = document.body
        this.has_pointer_lock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document
        if (this.has_pointer_lock === true) {
            console.log('Pointer lock is supported!')
            // Hook pointer lock state change events.
            document.addEventListener('pointerlockchange', this.pointer_lock_change.bind(this), false)
            document.addEventListener('mozpointerlockchange', this.pointer_lock_change.bind(this), false)
            document.addEventListener('webkitpointerlockchange', this.pointer_lock_change.bind(this), false)
            // Hook pointer lock error events.
            document.addEventListener('pointerlockerror', this.pointer_lock_error.bind(this), false)
            document.addEventListener('mozpointerlockerror', this.pointer_lock_error.bind(this), false)
            document.addEventListener('webkitpointerlockerror', this.pointer_lock_error.bind(this), false)
            // Hook for mouse click.
            document.addEventListener('click', this.mouse_click.bind(this), false)
            // Hook for key down presses.
            document.addEventListener('keydown', this.key_down.bind(this), false)
            // Hook for key up presses.
            document.addEventListener('keyup', this.key_up.bind(this), false)
        } else {
            console.log('Pointer lock is not supported!')
        }
    },

    pointer_lock_change: function () {
        if (document.pointerLockElement === this.element || document.mozPointerLockElement === this.element || document.webkitPointerLockElement === this.element) {
            this.currently_locked = true
            console.log('Pointer lock enabled!')
            this.controls.enable()
        } else {
            this.currently_locked = false
            console.log('Pointer lock disabled!')
            this.controls.disable()
        }
    },

    pointer_lock_error: function() {
        console.log('Pointer lock error!')
    },

    mouse_click: function() {
        if (this.currently_locked === false) {
            if (this.l_key_currently_down === true) {
                this.element.requestPointerLock = this.element.requestPointerLock || this.element.mozRequestPointerLock || this.element.webkitRequestPointerLock
                this.element.requestPointerLock()
            }
        }
    },

    key_down: function(event) {
        // l key.
        if (event.which == 76) {
            this.l_key_currently_down = true
        }
    },

    key_up: function(event) {
        // l key.
        if (event.which == 76) {
            this.l_key_currently_down = false
        }
    }
}