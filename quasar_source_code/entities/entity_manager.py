# coding=utf-8

"""This module, entity_manager.py, contains management code and a class for dealing with entities."""

from quasar_source_code.entities.database import entity_database as ed
from quasar_source_code.universal_code import time_abstraction as ta


class EntityManager(object):
	"""Defines management operations for Entities."""

	def __init__(self, manager_id=-1):
		super().__init__()
		self.entities             = []
		self._owner_id            = None
		self._manager_id          = manager_id
		self._entity_database_api = ed.EntityDatabaseAPI()

	@property
	def manager_id(self) -> int:
		"""Returns the manager_id of this manager, -1 if error."""
		return self._manager_id

	def print_entities(self):
		"""Prints the information of all the entities."""
		print('Printing information on the entities!')
		for e in self.entities:
			print(str(e))
		print('------------------------------------------')

	def print_all_entities(self):
		"""Prints information for all entities and any linked entities."""
		print('Printing information on the entities and all linked entities!')
		for e in self.entities:
			print(str(e))
			for e_child in e.all_children:
				print(str(e_child))
		print('------------------------------------------')

	def add_entities(self, e):
		"""Adds an entity to be managed."""
		if type(e) == list or type(e) == tuple:
			for _e in e:
				self.entities.append(_e)
		else:
			self.entities.append(e)

	def print_information_for_specific_day(self, day_obj):
		"""Prints information relevant to the specific day passed in."""
		print('Printing information for ' + ta.Day(ta.get_day_of_the_week_number_from_datetime(day_obj)).name + ' : ' + str(day_obj))

		for e in self.entities:
			data = e.get_all_information_relevant_for_date(day_obj)
			for d in data:
				print(d)

	def print_information_for_this_week(self):
		"""Prints all information relevant to this week."""
		self.print_information_for_specific_day(ta.get_day_object_from_current_weeks_day(ta.Day.MONDAY))
		print()
		self.print_information_for_specific_day(ta.get_day_object_from_current_weeks_day(ta.Day.TUESDAY))
		print()
		self.print_information_for_specific_day(ta.get_day_object_from_current_weeks_day(ta.Day.WEDNESDAY))
		print()
		self.print_information_for_specific_day(ta.get_day_object_from_current_weeks_day(ta.Day.THURSDAY))
		print()
		self.print_information_for_specific_day(ta.get_day_object_from_current_weeks_day(ta.Day.FRIDAY))
		print()
		self.print_information_for_specific_day(ta.get_day_object_from_current_weeks_day(ta.Day.SATURDAY))
		print()
		self.print_information_for_specific_day(ta.get_day_object_from_current_weeks_day(ta.Day.SUNDAY))
		print()

	def print_information_by_entities(self):
		"""Prints information sorted by entities."""
		y = 2 # TODO : This function

	def __str__(self):
		return 'EntityManager - owner_id{' + str(self._owner_id) + '}, manager_id{' + str(self.manager_id) + '}, entities{' + str(self.entities) + '}'
