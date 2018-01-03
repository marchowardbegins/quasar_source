# coding=utf-8

"""This module, utility_server_host.py, provides an abstraction to running a mini server."""

import zmq
import time
from universal_code import output_coloring as oc
from universal_code import path_manager as pm
from universal_code import useful_file_operations as ufo

from entities.database.entity_database import EntityDatabaseAPI
from entities import base_entity as be

# Utility variables.
ADDRESS = 'address'
PORT    = 'port'

# Pre-defined utility servers.
SERVER_ENTITY  = 'zmq_entity'
SERVER_FINANCE = 'zmq_finance'
SERVER_QUASAR  = 'zmq_quasar'


class ZMQBase(object):
	"""Defines the common networking variables."""

	def __init__(self, name, ip, port):
		self._name    = name
		self._ip      = ip
		self._port    = port
		self._context = None
		self._socket  = None

	def _initialize_zmq_variables(self):
		"""Initializes the ZMQ specific variables."""
		self._context = zmq.Context()
		self._socket = self._context.socket(zmq.PAIR)

	# Code from https://stackoverflow.com/questions/7585435/best-way-to-convert-string-to-bytes-in-python-3
	def to_bytes(self, arg):
		"""Utility function."""
		if isinstance(arg, str):
			return arg.encode()
		return arg

	def to_str(self, arg):
		"""Utility function."""
		if isinstance(arg, bytes):
			return arg.decode()
		return arg


class HostServer(ZMQBase):
	"""Represents a single unique host server."""

	def __init__(self, name, ip, port):
		super().__init__(name, ip, port)

		self._reconnection_interval = 10

	def run(self):
		"""Runs the host server."""
		oc.print_title('Binding server{' + self._name + '}')
		self._initialize_zmq_variables()
		self._socket.bind('tcp://' + self._ip + ':' + self._port)
		oc.print_data_with_red_dashes_at_start('Binded! Running server!')

		response_number = 0

		while True:

			print('Server waiting for message...')

			message = self.to_str(self._socket.recv())

			print('Server got the message : ')
			print(message)

			self._socket.send(self.to_bytes('Server says hello{' + str(response_number) + '}'))

			time.sleep(1)


class ClientConnection(ZMQBase):
	"""Represents a single client connection to a host server."""

	def __init__(self, name, ip, port):
		super().__init__(name, ip, port)

	def attempt_connection(self):
		"""Attempt to connect to the host server."""
		oc.print_title('Attempting connection to host server!')
		self._initialize_zmq_variables()
		self._socket.connect('tcp://' + self._ip + ':' + self._port)
		oc.print_data_with_red_dashes_at_start('Connected! Running client!')

	def send_message(self, m):
		"""Sends the message to the host server."""
		self._socket.send(self.to_bytes(m))
		return self.to_str(self._socket.recv())


class EntityServer(object):
	"""Represents the Entity Data Server."""

	def __init__(self):
		self._host_server_data = ufo.get_ini_section_dictionary(pm.get_config_ini(), SERVER_ENTITY)
		self._host_server = HostServer(SERVER_ENTITY, self._host_server_data[ADDRESS], self._host_server_data[PORT])

		self._db_api = EntityDatabaseAPI()

	def run(self):
		"""Runs the entity server."""
		self._host_server.run()


class QuasarServer(object):
	"""Represents the Quasar utility server."""

	def __init__(self):
		self._host_server_data = ufo.get_ini_section_dictionary(pm.get_config_ini(), SERVER_QUASAR)
		self._host_server = HostServer(SERVER_QUASAR, self._host_server_data[ADDRESS], self._host_server_data[PORT])

		# Client connection to the entity data server.
		self._entity_server_data = ufo.get_ini_section_dictionary(pm.get_config_ini(), SERVER_ENTITY)
		self._entity_server_connection = ClientConnection('client:' + SERVER_ENTITY, self._entity_server_data[ADDRESS], self._entity_server_data[PORT])

	def run(self):
		"""Runs the Quasar server."""
		self._entity_server_connection.attempt_connection()

		response = self._entity_server_connection.send_message('Hello from client 0')
		print('Client got this response : ' + response)
		time.sleep(2)
		self._entity_server_connection.send_message('Hello from client 1')
		print('Client got this response : ' + response)
		time.sleep(4)
		self._entity_server_connection.send_message('Hello from client 2')
		print('Client got this response : ' + response)

