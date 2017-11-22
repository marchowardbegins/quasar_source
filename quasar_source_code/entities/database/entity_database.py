# coding=utf-8

"""This module, entity_database.py, contains a database api layer for entity objects."""

import dill
import psycopg2

from quasar_source_code.database_api.nosql_databases import mongodb_api as db_api

from quasar_source_code.database_api.sql_databases import database_tables as db_t
from quasar_source_code.entities import base_entity as be
from quasar_source_code.entities.entity_manager import EntityManager
from quasar_source_code.universal_code import debugging as dbg
from quasar_source_code.universal_code import time_abstraction as ta

'''  __       ___       __        __   ___          __
	|  \  /\   |   /\  |__)  /\  /__` |__      /\  |__) |    .
	|__/ /~~\  |  /~~\ |__) /~~\ .__/ |___    /~~\ |    |    .
'''

# Utility indexes.
INDEX_OWNER_NAME       = 0
INDEX_OWNER_PASSWORD   = 1
INDEX_OWNER_EMAIL      = 2
INDEX_OWNER_ID         = 3
INDEX_OWNER_MANAGER_ID = 4


class EntityDatabaseAPI(object):
	"""An API for Entity database operations."""

	def __init__(self, debug=False):
		self._debug     = debug
		self._api       = db_api.MongoDBAPI()
		self._owners_collection = self._api.get_collection('owners')

	def get_all_owners(self):
		"""Gets all the owners from the database."""
		return self._owners_collection.get_all()

	def connect(self):
		"""Connect to the database."""
		self._api.connect()

	def terminate(self):
		"""Cleanly exit the connection from the database."""
		self._api.terminate()

	# TODO : save_entity_manager(self, entity_manager):

	# TODO : create_owner(self, name: str, password: str, email: str):
