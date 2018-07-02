'use strict';

const DOM_ELEMENT_CANVAS = 'canvas'; // #pre-process_global_constant
const DOM_ELEMENT_DIV    = 'div';    // #pre-process_global_constant
const DOM_ELEMENT_H1     = 'h1';     // #pre-process_global_constant
const DOM_ELEMENT_H2     = 'h2';     // #pre-process_global_constant
const DOM_ELEMENT_H3     = 'h3';     // #pre-process_global_constant
const DOM_ELEMENT_H4     = 'h4';     // #pre-process_global_constant
const DOM_ELEMENT_H5     = 'h5';     // #pre-process_global_constant

const DOM_ELEMENT_CONSTRUCTOR_TYPE_ID_NAME_EXISTS      = 1; // #pre-process_global_constant
const DOM_ELEMENT_CONSTRUCTOR_TYPE_ID_NAME_DNE         = 2; // #pre-process_global_constant
const DOM_ELEMENT_CONSTRUCTOR_TYPE_ELEMENT             = 3; // #pre-process_global_constant


$_QE.prototype.DomElement = function(data, data_type, dom_element_type, is_string) {
    this._dom_type = dom_element_type;
    switch (data_type) {
    case DOM_ELEMENT_CONSTRUCTOR_TYPE_ID_NAME_EXISTS:
        this._id_name = data;
        this._element = document.getElementById(this._id_name);
        break;
    case DOM_ELEMENT_CONSTRUCTOR_TYPE_ID_NAME_DNE:
        this._id_name = data;
        this._element = null;
        break;
    case DOM_ELEMENT_CONSTRUCTOR_TYPE_ELEMENT:
        this._element = data;
        this._id_name = this._element.id;
        break;
    }

    if (is_string) {
        $_QE.prototype.DomElementString.call(this);
    }

    // Default.
    this._display_style = 'block';

    //

    this.create_element = function() {
        this._element = document.createElement(this._dom_type);
        if (is_defined(this._id_name)) {
            this._element.id = this._id_name;
        }
    };

    //
    this.hide = function() {
        this._element.style.display = 'none';
        this.hidden = true;
    };

    this.show = function() {
        this._element.style.display = this._display_style;
        this.hidden = false;
    };

    this.make_invisible = function() {
        this._element.style.visibility = 'hidden';
        this.visible = false;
    };

    this.make_visible = function() {
        this._element.style.visibility = 'visible';
        this.visible = true;
    };

    //

    this.prepend_child_element = function(element_id) {
        return this._add_child_element(true, element_id);
    };

    this.append_child_element = function(element_id) {
        return this._add_child_element(false, element_id);
    };

    this.append_to_document_body = function() {
        document.body.appendChild(this._element);
    };

    this.add_class = function(class_name) {
        this._element.classList.add(class_name);
    };

    this.prepend_break = function() {
        let node = document.createElement('br');
        this._element.prepend(node);
    };

    this.add_break_element = function() {
        let node = document.createElement('br');
        this._element.appendChild(node);
    };

    this._add_child_element = function(prepend, element_id) {
        let node = document.createElement('div');
        node.id = element_id;
        if (prepend) {
            this._element.prepend(node);
        } else {
            this._element.appendChild(node);
        }
        return new $_QE.prototype.DomElement(element_id, DOM_ELEMENT_CONSTRUCTOR_TYPE_ID_NAME_EXISTS, DOM_ELEMENT_DIV, true);
    };

    //
    this.get_element = function() {
        return this._element;
    };

    this._get_offset = function(o) {
        if (o === 0) {
            return 0;
        }
        return o + 'px';
    };

    this.is_hidden = function() {
        return this.hidden;
    };

    this.is_visible = function() {
        return this.visible;
    };

    //

    this.set_id = function(_id) {
        if (this._id_name !== _id) {
            this._id_name = _id;
            this._element.id = _id;
        }
    };

    this.set_position_to_absolute = function() {
        this._element.style.position = 'absolute';
    };

    this.set_left_offset = function(o) {
        this._element.style.left = this._get_offset(o);
    };

    this.set_top_offset = function(o) {
        this._element.style.top = this._get_offset(o);
    };

    this.set_color = function(color) {
        this._element.style.color = color;
    };

    this.set_display_style = function(style) {
        this._display_style = style;
    };

};
