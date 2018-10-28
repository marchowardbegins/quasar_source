'use strict';

$_QE.prototype.FeatureSize = function() {};

Object.assign($_QE.prototype.FeatureSize.prototype, {

    set_dimensions: function(w, h) {
        if (w < 0) {
            QE.log_warning('Width is negative {' + w + '}');
        }
        if (h < 0) {
            QE.log_warning('Height is negative {' + h + '}');
        }
        this.width  = w;
        this.height = h;
    }

});


