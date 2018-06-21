'use strict';

$_QE.prototype.TextSyntaxPassword = function() {
    $_QE.prototype.TextSyntax.call(this, TEXT_SYNTAX_PASSWORD, 'Invalid password: ');
    this.add_syntax_rule(new $_QE.prototype.SyntaxRuleMinimumLength(4));
    this.add_syntax_rule(new $_QE.prototype.SyntaxRuleMaximumLength(32));
};