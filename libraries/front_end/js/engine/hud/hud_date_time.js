'use strict';

$_QE.prototype.HUDDateTime = function() {};

Object.assign(
    $_QE.prototype.HUDDateTime.prototype,
    $_QE.prototype.DomElementCanvas.prototype,
    $_QE.prototype.CanvasRenderingTextLines.prototype,
    $_QE.prototype.FeatureSize.prototype,
    {
        __init__: function(engine) {
            this.engine = engine;

            this.set_properties(2, 200, QE.FONT_ARIAL_12, GLOBAL_ID_DATE_TIME);
            this.initialize_gui();

            this.rows[0].set_text_alignment(TEXT_ALIGNMENT_END);
            this.rows[1].set_text_alignment(TEXT_ALIGNMENT_END);

            // TODO: Eventually have this be updating.
            this.rows[1].set_text(this.engine.manager_time.get_current_date_header());

            return this;
        },

        refresh: function() {
            this.engine.manager_time.refresh();
            this.rows[0].set_text(this.engine.manager_time.get_current_time_header());
        },

        add_message: function(message) {
            this.shift_rows_up();
            this.set_bottom_row(message);
        },
    }

);
