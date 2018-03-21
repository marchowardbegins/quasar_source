# coding=utf-8

"""This module, variable_setters.py, provides an abstraction to pre-defined variable setting statements."""

from code_api.code_abstraction.code_chunk import CodeChunk


class ShellVariableSetter(object):
    """Represents a single shell variable setter."""

    def __init__(self, code_chunk):
        self._code_chunk = code_chunk

    @property
    def code_chunk(self):
        """Returns the code chunk of this safety check."""
        return self._code_chunk


SHELL_VARIABLES_SET_QUASAR      = ShellVariableSetter(CodeChunk(['set_variables_for_quasar']))
SHELL_VARIABLES_SET_DATABOI     = ShellVariableSetter(CodeChunk(['set_variables_for_databoi']))
SHELL_VARIABLES_SET_SERVER_SIDE = ShellVariableSetter(CodeChunk(['set_variables_for_server_side']))
