'use strict';

function Visibility() {

    // States.
    this.currently_visible = true;
    // If this variable is set to to 'true' then calls to 'display_all_attachments_recursively' will not affect this Visibility object.
    this.manual_visibility = false;

    this.is_visible = function() {
        return this.currently_visible;
    };

    this.set_to_visible = function() {
        this.currently_visible = true;
        // Thanks to : https://stackoverflow.com/questions/42609602/how-to-hide-and-show-an-object-on-scene-in-three-js
        this.object3D.visible = true;
        this.object3D.traverse (function(child) {
            if (child instanceof THREE.Mesh) {
                child.visible = true;
            }
        });
    };

    this.set_to_invisible = function() {
        this.currently_visible = false;
        // Thanks to : https://stackoverflow.com/questions/42609602/how-to-hide-and-show-an-object-on-scene-in-three-js
        this.object3D.visible = false;
        this.object3D.traverse (function(child) {
            if (child instanceof THREE.Mesh) {
                child.visible = false;
            }
        });
    };

    /*__   ___  __          __   ___  __          ___ ___       __              ___      ___  __  
     |__) |__  /  \ |  | | |__) |__  /__`     /\   |   |   /\  /  ` |__|  |\/| |__  |\ |  |  /__` 
     |  \ |___ \__X \__/ | |  \ |___ .__/    /~~\  |   |  /~~\ \__, |  |  |  | |___ | \|  |  .__/ */

    this.display_self_and_all_child_attachments_recursively = function() {
        this.set_to_visible();
        for (var a = 0; a < this.attachments.length; a++) {
            if (!this.attachments[a].manual_visibility) {
                this.attachments[a].display_self_and_all_child_attachments_recursively();
            }
        }
    };

    this.force_display_self_and_all_child_attachments_recursively = function() {
        this.set_to_visible();
        for (var a = 0; a < this.attachments.length; a++) {
            this.attachments[a].force_display_self_and_all_child_attachments_recursively();
        }
    };

    this.hide_self_and_all_child_attachments_recursively = function() {
        this.set_to_invisible();
        for (var a = 0; a < this.attachments.length; a++) {
            if (!this.attachments[a].manual_visibility) {
                this.attachments[a].hide_self_and_all_child_attachments_recursively();
            }
        }
    };

    this.force_hide_self_and_all_child_attachments_recursively = function() {
        this.set_to_invisible();
        for (var a = 0; a < this.attachments.length; a++) {
            this.attachments[a].force_hide_self_and_all_child_attachments_recursively();
        }
    };

    this.display_all_child_attachments_with_name = function(n) {
        for (var a = 0; a < this.attachments.length; a++) {
            if (this.attachments[a].relative_name === n) {
                this.attachments[a].set_to_visible();
            }
        }
    };

    this.hide_all_child_attachments_with_name = function(n) {
        for (var a = 0; a < this.attachments.length; a++) {
            if (this.attachments[a].relative_name === n) {
                this.attachments[a].set_to_invisible();
            }
        }
    };

}