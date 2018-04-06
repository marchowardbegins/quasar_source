# coding=utf-8

"""This module, base_entity.py, defines the base object for all Entity objects as well as Entity constants."""

# All the current possible Entity types.
ENTITY_TYPE_BASE                   = 0
ENTITY_TYPE_TASK                   = 1
ENTITY_TYPE_WALL                   = 2
ENTITY_TYPE_ENTITY_GROUP           = 3
ENTITY_TYPE_OWNER                  = 4
ENTITY_TYPE_TEXT_REMINDER          = 5
ENTITY_TYPE_DYNAMIC_WORLD          = 6
ENTITY_TYPE_STATIC_WORLD           = 7
ENTITY_TYPE_DYNAMIC_WORLDS_MANAGER = 8
ENTITY_TYPE_STATIC_WORLDS_MANAGER  = 9

ENTITY_STATIC_WORLD_HOME     = 0
ENTITY_STATIC_WORLD_SETTINGS = 1
ENTITY_STATIC_WORLD_ADMIN    = 2


ENTITY_PROPERTY_START_TOKEN = '_p'
ENTITY_DEFAULT_PROPERTY_TYPE        = ENTITY_PROPERTY_START_TOKEN + '0'
ENTITY_DEFAULT_PROPERTY_CHILD_IDS   = ENTITY_PROPERTY_START_TOKEN + '1'
ENTITY_DEFAULT_PROPERTY_PARENT_IDS  = ENTITY_PROPERTY_START_TOKEN + '2'
ENTITY_DEFAULT_PROPERTY_RELATIVE_ID = ENTITY_PROPERTY_START_TOKEN + '3'

ENTITY_PROPERTY_OWNER                  = ENTITY_PROPERTY_START_TOKEN + '4'
ENTITY_PROPERTY_PASSWORD               = ENTITY_PROPERTY_START_TOKEN + '5'
ENTITY_PROPERTY_USERNAME               = ENTITY_PROPERTY_START_TOKEN + '6'
ENTITY_PROPERTY_EMAIL                  = ENTITY_PROPERTY_START_TOKEN + '7'
ENTITY_PROPERTY_NAME                   = ENTITY_PROPERTY_START_TOKEN + '8'
ENTITY_PROPERTY_POSITION               = ENTITY_PROPERTY_START_TOKEN + '9'
ENTITY_PROPERTY_LOOK_AT                = ENTITY_PROPERTY_START_TOKEN + '10'
ENTITY_PROPERTY_COMPLETED              = ENTITY_PROPERTY_START_TOKEN + '11'
ENTITY_PROPERTY_PHONE_NUMBER           = ENTITY_PROPERTY_START_TOKEN + '12'
ENTITY_PROPERTY_PHONE_CARRIER          = ENTITY_PROPERTY_START_TOKEN + '13'
ENTITY_PROPERTY_CREATED_AT_DATE        = ENTITY_PROPERTY_START_TOKEN + '14'
ENTITY_PROPERTY_IMAGE_DATA             = ENTITY_PROPERTY_START_TOKEN + '15'
ENTITY_PROPERTY_IS_ROOT_ATTACHABLE     = ENTITY_PROPERTY_START_TOKEN + '16'
ENTITY_PROPERTY_3D_ROWS                = ENTITY_PROPERTY_START_TOKEN + '17'
ENTITY_PROPERTY_2D_ROWS                = ENTITY_PROPERTY_START_TOKEN + '18'
ENTITY_PROPERTY_TAGS                   = ENTITY_PROPERTY_START_TOKEN + '19'
ENTITY_PROPERTY_NOTE                   = ENTITY_PROPERTY_START_TOKEN + '20'
ENTITY_PROPERTY_START_DATE_TIME        = ENTITY_PROPERTY_START_TOKEN + '21'
ENTITY_PROPERTY_END_DATE_DATE          = ENTITY_PROPERTY_START_TOKEN + '22'
ENTITY_PROPERTY_TIME_NEEDED            = ENTITY_PROPERTY_START_TOKEN + '23'
ENTITY_PROPERTY_TIME_DURATION          = ENTITY_PROPERTY_START_TOKEN + '24'
ENTITY_PROPERTY_OWNER_ACCOUNT_TYPE     = ENTITY_PROPERTY_START_TOKEN + '25'


class Entity(object):
	"""Defines properties of all entities."""

	# TODO : Create option to send out and also un-package a condensed version of Entities!!!

	def __init__(self):
		self._parent_entities = []
		self._child_entities  = []
		# Holds all other data attached to this entity.
		self._properties     = {}
		self.set_property_and_value(ENTITY_DEFAULT_PROPERTY_RELATIVE_ID, -1)
		self.set_property_and_value(ENTITY_DEFAULT_PROPERTY_TYPE, ENTITY_TYPE_BASE)

	def set_property_and_value(self, key, value):
		"""Sets a specific key{also called entity property} and its value."""
		self._properties[key] = value

	'''__   ___ ___ ___  ___  __   __  
	  / _` |__   |   |  |__  |__) /__` 
	  \__> |___  |   |  |___ |  \ .__/ '''
	@property
	def properties(self) -> dict:
		"""Returns the properties of this entity."""
		return self._properties

	def has_property(self, key) -> bool:
		"""Returns True if this entity has the property."""
		if key == ENTITY_DEFAULT_PROPERTY_RELATIVE_ID:
			if self.get_value(ENTITY_DEFAULT_PROPERTY_RELATIVE_ID) == -1:
				return False
			return True
		return key in self._properties

	def get_value(self, key):
		"""Returns the value for the provided property key."""
		return self._properties[key]

	@property
	def relative_id(self) -> int:
		"""Returns the global ID of this Entity."""
		return self.get_value(ENTITY_DEFAULT_PROPERTY_RELATIVE_ID)

	# TODO : REFORMAT EVERYTHING BELOW
	# TODO : REFORMAT EVERYTHING BELOW
	# TODO : REFORMAT EVERYTHING BELOW

	@property
	def is_child(self) -> bool:
		"""Returns a boolean indicating if this entity has parent entities and no child entities."""
		return len(self._child_entities) == 0 and len(self._parent_entities) > 0

	@property
	def is_parent(self) -> bool:
		"""Returns a boolean indicating if this entity has any child entities."""
		return len(self._child_entities) > 0

	@property
	def parents(self) -> list:
		"""Returns a list of parent entities relative to this entity."""
		return self._parent_entities

	@property
	def all_parents(self) -> list:
		"""Returns a list of ALL parent entities relative to this entity."""
		if len(self._parent_entities) == 0:
			return [self]
		parent_entities = []
		for pe in self._parent_entities:
			parent_entities += pe.all_parents
		return parent_entities

	@property
	def children(self) -> list:
		"""Returns a list of child entities relative to this entity."""
		return self._child_entities

	@property
	def all_children(self) -> list:
		"""Returns a list of ALL child entities relative to this entity."""
		if len(self._child_entities) == 0:
			return []
		child_entities = [] + self._child_entities
		for ce in self._child_entities:
			child_entities += ce.all_children
		return child_entities

	def __str__(self):
		return 'Entity[' + str(self.get_value(ENTITY_DEFAULT_PROPERTY_RELATIVE_ID)) + ']'

	'''  __               __       /     __        __   ___      ___     __   __   ___  __       ___    __        __
		/  ` |__| | |    |  \     /     |__)  /\  |__) |__  |\ |  |     /  \ |__) |__  |__)  /\   |  | /  \ |\ | /__`    .
		\__, |  | | |___ |__/    /      |    /~~\ |  \ |___ | \|  |     \__/ |    |___ |  \ /~~\  |  | \__/ | \| .__/    .'''

	# Private utility functions.
	def _add_child(self, entity):
		"""Adds a single child entity to this entity."""

		if type(entity) == int:
			print(entity)
			raise Exception('YO ENTITY WAS AN INT')

		if entity not in self._child_entities:
			self._child_entities.append(entity)
			# Make sure the child entity has a parent pointer to self.
			if self not in entity.parents:
				entity.add_parents(self)

	def _add_parent(self, entity):
		"""Adds a single parent entity to this entity."""

		if type(entity) == int:
			print(entity)
			raise Exception('YO ENTITY WAS AN INT')

		if entity not in self._parent_entities:
			self._parent_entities.append(entity)
			# Make sure this parent has this entity as a child.
			if self not in entity.children:
				entity.add_children(self)

	def _remove_child(self, entity):
		"""Removes a single child entity from this entity."""

		if type(entity) == int:
			print(entity)
			raise Exception('YO ENTITY WAS AN INT')

		if self in entity.parents:
			entity.remove_parent(self)
		if entity in self.children:
			self._child_entities.remove(entity)

	def _remove_parent(self, entity):
		"""Removes a single parent entity from this entity."""

		if type(entity) == int:
			print(entity)
			raise Exception('YO ENTITY WAS AN INT')

		if self in entity.children:
			entity.remove_child(self)
		if entity in self.parents:
			self._parent_entities.remove(entity)

	# Public functions.

	def remove_parent(self, obj):
		"""Removes the provided parent entity from this entity."""
		if type(obj) == list or type(obj) == tuple:
			for e in obj:
				self._remove_parent(e)
		else:
			self._remove_parent(obj)

	def remove_children(self, obj) -> None:
		"""Removes n child entities from this entity."""
		if type(obj) == list or type(obj) == tuple:
			for e in obj:
				self._remove_child(e)
		else:
			self._remove_child(obj)

	def add_children(self, obj) -> None:
		"""Adds n child entities to this entity."""
		if type(obj) == list or type(obj) == tuple:
			for e in obj:
				self._add_child(e)
		else:
			self._add_child(obj)

	def add_parents(self, obj) -> None:
		"""Adds n parent entities to this entity."""
		if type(obj) == list or type(obj) == tuple:
			for e in obj:
				self._add_parent(e)
		else:
			self._add_parent(obj)
