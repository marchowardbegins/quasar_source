'use strict';

$_QE.prototype.FeatureButtonState = function() {

    this._enabled = true;
    this._locked  = false;

    this._icon = new $_QE.prototype.FloatingIcon(this.world, ASSET_ICON_CROSS, 32, QE.COLOR_RED, true);
    this._icon.offset_depth_distance = 1;
    this._icon.manual_visibility = true;
    this.add_attachment(this._icon);
    this._icon.set_to_invisible();

    this.disable = function() {
        this._enabled = false;
        this._icon.switch_icon(ASSET_ICON_DISABLED);
        this._icon.set_to_visible();
    };

    this.lock = function() {
        this._locked = true;
        this._icon.switch_icon(ASSET_ICON_LOCKED);
        this._icon.set_to_visible();
    };

    this.enable = function() {
        this._enabled = true;
        this._icon.set_to_invisible();
    };

    this.unlock = function() {
        this._locked = false;
        this._icon.set_to_invisible();
    };

    this.enabled = function() {
        return this._enabled && !this._locked;
    };

};