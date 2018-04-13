# coding=utf-8

"""This module, quasar_server.py, is the utility quasar client to the entity server."""

from servers import utility_servers as us

import time
from universal_code import path_manager as pm
from universal_code import useful_file_operations as ufo
from entities import base_entity as be
from universal_code import system_os as so

import threading as t


class QuasarServer(object):
	"""Represents the Quasar utility server."""

	def __init__(self):
		#self._host_server_data = ufo.get_ini_section_dictionary(pm.get_config_ini(), SERVER_QUASAR)
		#self._host_server = HostServer(SERVER_QUASAR, self._host_server_data[ADDRESS], self._host_server_data[PORT])

		# Client connection to the entity data server.
		self._entity_server_data = ufo.get_ini_section_dictionary(pm.get_config_ini(), us.SERVER_ENTITY)
		self._entity_server_connection = us.ClientConnection('client:' + us.SERVER_ENTITY, self._entity_server_data[us.ADDRESS], self._entity_server_data[us.PORT])

		self._client_message_lock = t.Lock()

	def connect(self):
		"""Performs the initial connection."""
		self._entity_server_connection.attempt_connection()

	def ping(self):
		"""Performs an alive test."""
		return self._send_command_to_entity_server(us.SERVER_COMMAND_PING)

	def update_batch_of_entitiies(self, username, entity_batch_data):
		"""Updates a batch of entities."""
		return self._send_command_to_entity_server(us.SERVER_COMMAND_UPDATE_ENTITY_BATCH, username + '|' + str(entity_batch_data))

	def update_entity(self, username, entity_data):
		"""Updates an entity for the provided entity owner."""
		return self._send_command_to_entity_server(us.SERVER_COMMAND_UPDATE_ENTITY, username + '|' + str(entity_data))

	def create_entity_owner(self, owner_data):
		"""Creates a new entity owner."""
		return self._send_command_to_entity_server(us.SERVER_COMMAND_CREATE_ENTITY_OWNER, owner_data)

	def _send_command_to_entity_server(self, command, data=''):
		"""Sends a command to the entity server."""
		self._client_message_lock.acquire()
		reply = self._entity_server_connection.send_message(command + ':' + str(data))
		self._client_message_lock.release()
		return reply

	'''__   ___ ___ ___  ___  __   __
	  / _` |__   |   |  |__  |__) /__`
	  \__> |___  |   |  |___ |  \ .__/ '''
	def get_shared_worlds(self, username):
		"""Gets shared worlds for the specified username."""
		return self._send_command_to_entity_server(us.SERVER_COMMAND_GET_SHARED_WORLDS, username)

	def is_username_taken(self, username):
		"""Checks if the username is taken."""
		return self._send_command_to_entity_server(us.SERVER_COMMAND_IS_USERNAME_TAKEN, username)

	def get_all_data(self):
		"""Returns all the data in the database."""
		reply = self._send_command_to_entity_server(us.SERVER_COMMAND_REQUEST_ALL_DATA)
		#print(reply)
		return reply

	def is_valid_login(self, username, password):
		"""Checks that the login username and password have a match."""
		return self._send_command_to_entity_server(us.SERVER_COMMAND_IS_LOGIN_INFORMATION_VALID, username + '|' + password)

	def get_owner_entities(self, username):
		"""Gets owner entities for the provided owner."""
		#print('Quasar Utility Server getting owner entities for username{' + username + '}')
		return self._send_command_to_entity_server(us.SERVER_COMMAND_GET_OWNER_ENTITIES, username)

	'''__   ___       ___ ___    __
	  |  \ |__  |    |__   |  | /  \ |\ |
	  |__/ |___ |___ |___  |  | \__/ | \| '''
	def delete_entity(self, owner_username, entity_relative_id):
		"""Deletes the provided entity for the needed owner (found from the provided username)."""
		return self._send_command_to_entity_server(us.SERVER_COMMAND_DELETE_ENTITY, owner_username + '|' + str(entity_relative_id))

	'''     __                   __   __   ___  __       ___    __        __
       /\  |  \  |\/| | |\ |    /  \ |__) |__  |__)  /\   |  | /  \ |\ | /__`
	  /~~\ |__/  |  | | | \|    \__/ |    |___ |  \ /~~\  |  | \__/ | \| .__/ '''
	def get_all_accounts_information(self):
		"""Returns a list of all the accounts and their account type."""
		return self._send_command_to_entity_server(us.SERVER_COMMAND_ENTITY_OWNER_SUDO_OPERATION, us.SERVER_COMMAND_GET_ALL_ACCOUNTS_INFORMATION)

	def set_entity_owner_account_type(self, username, account_type):
		"""Sets an entity owner's account type."""
		return self._send_command_to_entity_server(us.SERVER_COMMAND_ENTITY_OWNER_SUDO_OPERATION, us.SERVER_COMMAND_SET_ENTITY_OWNER_ACCOUNT_TYPE + ':' + username + '|' + account_type)

	def delete_entity_owner(self, username):
		"""Deletes the entity owner found by username match."""
		return self._send_command_to_entity_server(us.SERVER_COMMAND_ENTITY_OWNER_SUDO_OPERATION, us.SERVER_COMMAND_DELETE_ENTITY_OWNER + ':' + username)
