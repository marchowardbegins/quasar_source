# coding=utf-8

"""This module, entity_server.py, is used to manager a server's memory + cache of entity managers and owners."""

from quasar_source_code.entities.database import entity_database
from quasar_source_code.entities import base_entity as be
from quasar_source_code.entities.server_side import text_reminders as tr

# Needed for sending a simple HttpResponse such as a string response.
from django.http import HttpResponse

from quasar_source_code.universal_code import time_abstraction as ta

import json

from django.http import JsonResponse

from quasar_source_code.entities.database.entity_database import EntityDatabaseAPI


# Utility indexes.
INDEX_OWNER_NAME       = 0
INDEX_OWNER_PASSWORD   = 1
INDEX_OWNER_EMAIL      = 2
INDEX_OWNER_ID         = 3
INDEX_OWNER_MANAGER_ID = 4

# Server response messages.
SERVER_REPLY_INVALID_POST_DATA_ERROR                = HttpResponse('Invalid POST data!')
SERVER_REPLY_INVALID_NUMBER_OF_POST_ARGUMENTS_ERROR = HttpResponse('Invalid number of POST arguments!')
SERVER_REPLY_GENERIC_NO                             = HttpResponse('n')
SERVER_REPLY_GENERIC_YES                            = HttpResponse('y')
SERVER_REPLY_GENERIC_SERVER_ERROR                   = HttpResponse('Server Error!')

# Entity properties.
ENTITY_PROPERTY_ID       = 'ENTITY_PROPERTY_ID'
ENTITY_PROPERTY_TYPE     = 'ENTITY_PROPERTY_TYPE'
ENTITY_PROPERTY_POSITION = 'ENTITY_PROPERTY_POSITION'
ENTITY_PROPERTY_LOOK_AT  = 'ENTITY_PROPERTY_LOOK_AT'
ENTITY_PROPERTY_NAME     = 'ENTITY_PROPERTY_NAME'

# Entity types.
ENTITY_TYPE_TASK            = 'EntityTask'
ENTITY_TYPE_TIME            = 'EntityTime'
ENTITY_TYPE_BASE            = 'Entity'
ENTITY_TYPE_WALL            = 'EntityWall'
ENTITY_TYPE_OWNER           = 'EntityOwner'
ENTITY_TYPE_TEXT_REMINDER   = 'EntityTextReminder'
ENTITY_TYPE_NO_SPECIAL_TYPE = 'EntityNoSpecialType'

# Owner dictionary key mappings.
OWNER_KEY_NAME      = 'name'
OWNER_KEY_PASSWORD  = 'password'
OWNER_KEY_EMAIL     = 'email'
OWNER_KEYS_REQUIRED = [OWNER_KEY_PASSWORD, OWNER_KEY_NAME, OWNER_KEY_EMAIL]
OWNER_KEY_ID        = '_id'


class EntityServer(object):
	"""Memory layer for entity managers and owners."""

	def __init__(self):
		self._db_api = EntityDatabaseAPI()

	def is_valid_login_info(self, username, password) -> bool:
		"""Returns a boolean indicating if a username and password combination is valid."""
		return self._db_api.is_valid_owner(username, password)

	def create_owner(self, owner_data):
		"""Creates an owner."""
		# Required keys passed in check.
		for required_key in OWNER_KEYS_REQUIRED:
			if required_key not in owner_data:
				return HttpResponse('Required key data not provided for creating an owner! Missing at least {' + required_key + '} from the provided {' + str(owner_data) + '}')

		# Username not already taken check.
		if self._db_api.is_owner_name_taken(owner_data[OWNER_KEY_NAME]):
			return HttpResponse('The username{' + owner_data[OWNER_KEY_NAME] + '} is already taken!')

		# Checks passed, create the owner.
		self._db_api.create_owner(owner_data)
		return SERVER_REPLY_GENERIC_YES

	def update_owner(self, owner_data):
		# Required keys passed in check.
		if OWNER_KEY_ID not in owner_data:
			return HttpResponse('Required key data not provided for updating an owner! Missing at the _id key from ' + str(owner_data) + '}')

		# Owner ID exists check.
		if not self._db_api.is_owner_id_valid(owner_data[OWNER_KEY_ID]):
			return HttpResponse('The owner ID{' + str(owner_data[OWNER_KEY_ID]) + '} is not valid!')

		self._db_api.update_owner(owner_data)
		return SERVER_REPLY_GENERIC_YES
