'use strict'

// Floating2DText types.
const TYPE_INPUT_PASSWORD = 1 // Input password field.
const TYPE_INPUT_REGULAR  = 2 // Regular input field.
const TYPE_LABEL          = 3 // Static text.
const TYPE_BUTTON         = 4 // Static text that can be clicked.
const TYPE_STATUS         = 5 // Dynamic non-interactive text.
const TYPE_TITLE          = 6 // Static title text.

// Highlight color.
const COLOR_HIGHLIGHT      = 0xD4FF93
const COLOR_TEXT_HIGHLIGHT = '#D4FF93'
const COLOR_TEXT_DEFAULT   = '#67ffbf'
const COLOR_WHITE          = '#ffffff'
const COLOR_BLACK          = '#000000'

// Base code from : https://stackoverflow.com/questions/46155/how-to-validate-email-address-in-javascript
function is_email_valid(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(email)
}