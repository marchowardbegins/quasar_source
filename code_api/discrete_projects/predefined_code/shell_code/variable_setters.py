# coding=utf-8

"""This module, variable_setters.py, provides an abstraction to pre-defined variable setting statements."""

from code_api.code_abstraction.code_chunk import CodeChunk


SHELL_VARIABLES_SET_DATABOI            = CodeChunk(['set_variables_for_databoi'])
SHELL_VARIABLES_SET_SERVER_SIDE        = CodeChunk(['set_variables_for_server_side'])
SHELL_VARIABLES_SET_CLIENT_SIDE        = CodeChunk(['set_variables_for_client_side'])
SHELL_VARIABLES_SET_QUASAR_SERVER      = CodeChunk(['set_variables_for_quasar_server'])
SHELL_VARIABLES_SET_FINANCE_SERVER     = CodeChunk(['set_variables_for_finance_server'])
SHELL_VARIABLES_SET_ENTITY_SERVER      = CodeChunk(['set_variables_for_entity_server'])
SHELL_VARIABLES_SET_QUASAR_MAINTENANCE = CodeChunk(['set_variables_for_quasar_maintenance'])
# OLD ABOVE



SHELL_VARIABLES_QUASAR_CONNECTION    = CodeChunk(['set_variables_for_quasar_connection'])
SHELL_VARIABLES_QUASAR_PROJECT_SETUP = CodeChunk(['set_variables_for_quasar_project_setup'])
