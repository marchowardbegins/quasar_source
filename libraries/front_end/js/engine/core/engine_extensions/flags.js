'use strict';

const ENGINE_SETTING_STATE_AUDIO      = 0; // #pre-process_global_constant
const ENGINE_SETTING_STATE_SHADERS    = 1; // #pre-process_global_constant
const ENGINE_SETTING_STATE_FXAA       = 2; // #pre-process_global_constant
const ENGINE_SETTING_STATE_OUTLINE    = 3; // #pre-process_global_constant
const ENGINE_SETTING_STATE_GRAIN      = 4; // #pre-process_global_constant
const ENGINE_SETTING_STATE_TRANSITION = 5; // #pre-process_global_constant

const CLIENT_FEATURE_CANVAS             = 6; // #pre-process_global_constant
const CLIENT_FEATURE_WEBGL              = 7; // #pre-process_global_constant
const CLIENT_FEATURE_WEB_WORKERS        = 8; // #pre-process_global_constant
const CLIENT_FEATURE_MOBILE             = 9; // #pre-process_global_constant
const CLIENT_FEATURE_VR                 = 10; // #pre-process_global_constant
const CLIENT_FEATURE_FULL_SCREEN        = 11; // #pre-process_global_constant
const CLIENT_FEATURE_POINTER_LOCK       = 12; // #pre-process_global_constant
const CLIENT_FEATURE_SCROLLING          = 13; // #pre-process_global_constant

const ENGINE_BINDING_FULL_SCREEN_DEFAULT = 14; // #pre-process_global_constant
const ENGINE_BINDING_WHEEL_MODE_DEFAULT  = 15; // #pre-process_global_constant

const ENGINE_STATE_POINTER_LOCKED       = 16; // #pre-process_global_constant
const ENGINE_STATE_FULL_SCREEN          = 17; // #pre-process_global_constant

const ENGINE_STATE_MOUSE_Y_DISABLED     = 18; // #pre-process_global_constant

const ENGINE_STATE_IN_TRANSITION        = 19; // #pre-process_global_constant

Object.assign(
    $_QE.prototype,
    $_QE.prototype.BooleanFlagsStatic.prototype,
    {
        flags: new Uint32Array(2),

        _set_flag_states: function() {
            this.set_flag_on(ENGINE_SETTING_STATE_AUDIO     );
            this.set_flag_on(ENGINE_SETTING_STATE_SHADERS   );
            this.set_flag_on(ENGINE_SETTING_STATE_FXAA      );
            this.set_flag_on(ENGINE_SETTING_STATE_OUTLINE   );
            this.set_flag_on(ENGINE_SETTING_STATE_GRAIN     );
            this.set_flag_on(ENGINE_SETTING_STATE_TRANSITION);

            // Required.
            this.set_flag(CLIENT_FEATURE_CANVAS, !!window.CanvasRenderingContext2D);

            // Required.
            this.set_flag(CLIENT_FEATURE_WEBGL, !!window.WebGLRenderingContext);

            // Not required (for now).
            this.set_flag(CLIENT_FEATURE_WEB_WORKERS, !!window.Worker);

            // Not required.
            // From : https://stackoverflow.com/questions/3514784/what-is-the-best-way-to-detect-a-mobile-device-in-jquery
            this.set_flag(CLIENT_FEATURE_MOBILE, /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
                    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4)));

            // Not required.
            this.set_flag(CLIENT_FEATURE_VR, navigator.getVRDisplays != null && navigator.getVRDisplays().length !== 0);

            // Not required.
            this.set_flag(CLIENT_FEATURE_FULL_SCREEN, !!document.webkitCancelFullScreen || !!document.mozCancelFullScreen);

            // Not required.
            this.set_flag(CLIENT_FEATURE_POINTER_LOCK, 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document);

            // Not required.
            this.set_flag(CLIENT_FEATURE_SCROLLING, 'onwheel' in document || 'onmousehweel' in document);

        },

        are_required_features_enabled: function() {
            this._set_flag_states();
            return this.get_flag(CLIENT_FEATURE_CANVAS) && this.get_flag(CLIENT_FEATURE_WEBGL);
        },

        get_names_of_required_features_not_enabled: function() {
            let names = '[';
            if (!this.get_flag(CLIENT_FEATURE_CANVAS)) {
                names += 'Canvas, ';
            }
            if (!this.get_flag(CLIENT_FEATURE_WEBGL)) {
                names += 'WebGL, ';
            }
            return names + ']';
        },

    }
);


/*
$_QE.prototype.ClientFunctionalityWindowFocus = function() {

    this.has_window_focus = null;

    this.on_window_focus_gain = function(event) {
        this.has_window_focus = true;
        event.preventDefault();
        event.stopPropagation();
    };

    this.on_window_focus_loss = function(event) {
        this.has_window_focus = false;
        event.preventDefault();
        event.stopPropagation();
    };

    window.addEventListener('focus', this.on_window_focus_gain.bind(this), true);
    window.addEventListener('blur', this.on_window_focus_loss.bind(this), true);
};
 */