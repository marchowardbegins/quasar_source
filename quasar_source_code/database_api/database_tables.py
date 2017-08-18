# coding=utf-8

"""This module, database_tables.py, defines an abstraction to database tables."""


'''          __   __   __  ___          __  ___  ___  __
	|  |\/| |__) /  \ |__)  |     |\ | /  \  |  |__  /__`    .
	|  |  | |    \__/ |  \  |     | \| \__/  |  |___ .__/    .

Not all possible database field types will be represented for now.
This is an abstraction to the database. Efficiency will intentionally be lost
in order to make development easier.
'''

import datetime
from typing import List

''' ___       __        ___     ___    ___       __   __
	 |   /\  |__) |    |__     |__  | |__  |    |  \ /__`    .
	 |  /~~\ |__) |___ |___    |    | |___ |___ |__/ .__/    .
'''


class TableField(object):
	"""Represents a field to a database table."""

	def __init__(self, field_name: str, field_type: str):
		self.field_name = field_name
		self.field_type = field_type


class TableFieldBoolean(TableField):
	"""Represents a boolean field for a database table."""

	def __init__(self, field_name: str):
		super().__init__(field_name, 'bool')


class TableFieldInteger(TableField):
	"""Represents an integer field for a database table."""

	def __init__(self, field_name: int, maximum_value: int):
		if maximum_value < 32767 + 1:
			super().__init__(field_name, 'smallint')
		elif maximum_value < 2147483647 + 1:
			super().__init__(field_name, 'integer')
		else:
			super().__init__(field_name, 'bigint')


class TableFieldDouble(TableField):
	"""Represents a decimal field for a database table."""

	def __init__(self, field_name):
		super().__init__(field_name, 'double precision')


class TableFieldString(TableField):
	"""Represents a string field for a database table."""

	def __init__(self, field_name: str, maximum_length: int, fixed_length: bool=False):
		if fixed_length:
			super().__init__(field_name, 'char(' + str(maximum_length) + ')')
		else:
			super().__init__(field_name, 'varchar(' + str(maximum_length) + ')')


class TableFieldDate(TableField):
	"""Represents a date field for a database table."""

	def __init__(self, field_name: str):
		super().__init__(field_name, 'date')


''' ___       __        ___
	 |   /\  |__) |    |__     .
	 |  /~~\ |__) |___ |___    .
'''


class DatabaseTable(object):
	"""Represents a table in a PostgreSQL database."""

	def __init__(self, table_name: str, database_api):
		self.table_name   = table_name
		self._database_api = database_api
		self._fields       = []
		self._exists       = None

	def _raise_exception_if_table_does_not_exist(self):
		"""Utility variable to provide sanity checks to table functions."""
		if not self.exists:
			raise Exception(self.table_name + ' does not exist in the database!')

	def _validify_value(self, value) -> str:
		"""Returns the value in valid format for SQL statements."""
		# TODO :
		#if type(value) == datetime.datetime:
		if type(value) == datetime.date:
			return '\'' + value.strftime('%Y-%m-%d') + '\''
		if type(value) == str:
			if value == 'NULL' or value == 'now()' or value == 'TRUE' or value == 'FALSE' or value == 'today':
				return value
			else:
				return '\'' + value + '\''
		return str(value)

	def insert_row(self, headers_and_values) -> None:
		"""Inserts the provided row into the table."""
		query = 'INSERT INTO ' + self.table_name + ' ('
		for h in self._fields:
			query += h.field_name + ', '
		query = query[:-2] + ') VALUES ('
		for h in self._fields:
			for key in headers_and_values:
				if h.field_name == key:
					query += self._validify_value(headers_and_values[key]) + ', '
		query = query[:-2] + ')'
		self._database_api.execute_query(query, save=True)

	def insert_rows(self, list_of_dictionaries: List[dict]) -> None:
		"""Inserts the provided rows into the table."""
		query = 'INSERT INTO ' + self.table_name + ' ('
		for h in self._fields:
			query += h.field_name + ', '
		query = query[:-2] + ') VALUES '
		for dictionary in list_of_dictionaries:
			query += '('
			for h in self._fields:
				for key in dictionary:
					if h.field_name == key:
						query += self._validify_value(dictionary[key]) + ', '
			query = query[:-2] + '), '
		query = query[:-2]
		self._database_api.execute_query(query, save=True)

	def delete_row_with_value(self, header: str, value) -> None:
		"""Deletes a row with the provided header-value match."""
		self._database_api.execute_query('DELETE FROM ' + self.table_name + ' WHERE ' + header + ' = ' + self._validify_value(value), save=True)

	def set_single_value(self, header_to_set: str, value_to_set, match_header: str, match_value):
		"""Sets a single values if a match was found."""
		self._database_api.execute_query('UPDATE ' + self.table_name + ' SET ' + header_to_set + ' = ' + self._validify_value(value_to_set) + ' WHERE ' + match_header + ' = ' + self._validify_value(match_value), save=True)

	def get_single_value(self, header_to_get: str, match_header: str, match_value):
		"""Returns a single value if a match was found."""
		return self._database_api.execute_custom_query_one_result('SELECT ' + header_to_get + ' FROM ' + self.table_name + ' WHERE ' + match_header + ' = ' + self._validify_value(match_value))[0]

	def has_value(self, header: str, value) -> bool:
		"""Returns a boolean indicating if this table has the header-value pair provided."""
		return self._database_api.execute_boolean_query('SELECT EXISTS (SELECT 1 FROM ' + self.table_name + ' WHERE ' + header + ' = ' + self._validify_value(value) + ' LIMIT 1)')

	def get_header_names(self) -> List[str]:
		"""Returns the header names of this table."""
		headers = []
		for f in self._fields:
			headers.append(f.field_name)
		return headers

	def get_row_values(self) -> List[str]:
		"""Returns the rows of this table."""
		self._raise_exception_if_table_does_not_exist()
		rows = self._database_api.execute_query_and_get_all_results('SELECT * FROM ' + self.table_name)
		row_values = []
		for r in rows:
			row_values.append(list(r))
		return row_values

	def print_all_data(self) -> None:
		"""Utility function to print all the data."""
		print(self.get_header_names())
		rows = self.get_row_values()
		for r in rows:
			print(r)

	def add_table_field(self, table_field: TableField):
		"""Adds a table field definition to this database table."""
		self._fields.append(table_field)

	def create_if_does_not_exist(self) -> None:
		"""Creates this table if it does not exist."""
		if not self.exists:
			query = 'CREATE TABLE ' + self.table_name + '('
			for i, f in enumerate(self._fields):
				if i != len(self._fields) - 1:
					query += f.field_name + ' ' + f.field_type + ', '
				else:
					query += f.field_name + ' ' + f.field_type + ');'
					self._database_api.execute_query(query, True)
					self._exists = True

	def delete_if_exists(self) -> None:
		"""Delete this table if it exists."""
		if self.exists:
			self._database_api.execute_query('DROP TABLE ' + self.table_name + ';', True)
			self._exists = False

	@property
	def exists(self) -> bool:
		"""Returns a boolean indicating if this table exists."""
		if self._exists is None:
			result = self._database_api.execute_custom_query_one_result("SELECT 1 FROM pg_catalog.pg_class WHERE relkind = 'r' AND relname = '" + self.table_name + "' AND pg_catalog.pg_table_is_visible(oid) LIMIT 1")
			self._exists = not (result is None)
		return self._exists
