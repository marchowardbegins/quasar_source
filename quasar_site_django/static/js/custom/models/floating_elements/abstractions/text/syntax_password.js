'use strict';

function TextSyntaxPassword() {
    this.__init__();
}

TextSyntaxPassword.prototype = {

    __init__: function() {
        TextSyntax.call(this, TEXT_SYNTAX_PASSWORD);
        this.add_syntax_rule(new SyntaxRuleMinimumLength(4));
        this.add_syntax_rule(new SyntaxRuleMaximumLength(32));
    }
};
