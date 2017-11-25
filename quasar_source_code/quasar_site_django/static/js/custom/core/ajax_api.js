'use strict';

function PostHelper(url) {
    this.__init__(url);
}

PostHelper.prototype = {

    // States.
    waiting_on_reply: null,
    url: null,

    __init__: function(url) {
        this.url = url;
    },

    perform_post: function(post_data, callback) {
        var self = this;
        this.waiting_on_reply = true;
        $.post(this.url, post_data, function(data, status) {
            if (status === 'success') {
                callback(data);
            } else {
                GUI_TYPING_INTERFACE.add_server_message('POST failed for ' + self.url);
                callback(status);
            }
            self.waiting_on_reply = false;
        });
    }
};