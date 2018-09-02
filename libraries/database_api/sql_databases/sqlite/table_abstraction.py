# coding=utf-8

"""This module, table_abstraction.py, represents a SQLite table."""

from libraries.database_api.sql_databases.sqlite import column_abstraction as col
from libraries.database_api.sql_databases.sql_query_abstraction import sql_query as sql


class TableAbstraction(object):
	"""Represents a SQLite table."""

	def __init__(self, table_name, many_to_many_tables=None):
		self._name                = table_name
		self._name_id             = self._set_name_id()
		self._columns             = []
		self._db                  = None
		self._create_cached_queries()
		self._primary_key         = None
		self._exists              = None
		self._table_id            = None
		self._many_to_many_tables = []
		if many_to_many_tables is not None:
			for mtm in many_to_many_tables:
				self.add_many_to_many(mtm)

	def add_many_to_many(self, table):
		"""Adds a table to be many to many with."""
		self._many_to_many_tables.append(table)
		return self._name + '_to_' + table.name

	def insert_if_does_not_exist(self, insert_data, dne_check_data):
		"""Inserts the data if there are no matches."""
		query_dne = sql.SQLQuerySingleResponse().SELECT_COUNT().FROM(self._name).WHERE(dne_check_data)
		count = self._db.execute_query(query_dne)
		data_exits = count != 0
		if not data_exits:
			self.insert(insert_data)

	def insert(self, keys_and_values, dne_check=False):
		"""Insert the row data provided."""
		if dne_check:
			self.insert_if_does_not_exist(keys_and_values, keys_and_values)
		else:
			query = sql.SQLQuery().INSERT(self._name, self.get_column_string(), self.get_values_string(keys_and_values))
			self._db.execute_query(query)

	def _set_name_id(self):
		"""Utility function."""
		grab_letter = True
		name_id     = ''
		for c in self._name:
			if grab_letter:
				name_id += c
				grab_letter = False
			else:
				if c == '_':
					grab_letter = True
		return name_id + '_id'

	@property
	def name_id(self):
		"""Returns the name of this table's primary ID."""
		return self._name_id

	@property
	def name(self):
		"""Returns the name of this table."""
		return self._name

	@property
	def primary_key(self):
		"""Returns the primary key Column."""
		return self._primary_key

	@property
	def table_id(self):
		"""Returns the table ID."""
		return self._table_id

	@table_id.setter
	def table_id(self, tid):
		"""Sets the table ID."""
		self._table_id = tid

	def _create_cached_queries(self):
		"""Creates queries to call ahead of time."""
		self._query_exists     = sql.SQLQueryBooleanResponse().SELECT('name').FROM('sqlite_master').WHERE({'type': 'table', 'name': self._name})
		self._query_drop_table = sql.SQLQuery().DROP_TABLE(self._name)

	def update_value(self, key_update, value_update, key_match, value_match):
		"""Updates a value for a given row match."""
		query = sql.SQLQuery().UPDATE(self._name).SET(key_update, value_update).WHERE_EQUALS_TO(key_match, value_match)
		self._db.execute_query(query)

	def has_value(self, key, value):
		"""Checks for any row with a key-value match."""
		query = sql.SQLQueryBooleanResponse().SELECT_ALL().FROM(self._name).WHERE_EQUALS_TO(key, value)
		return self._db.execute_query(query)

	def get_value(self, key_value, key_match, value_match):
		"""Gets a value from this table."""
		query = sql.SQLQuery().SELECT(key_value).FROM(self._name).WHERE_EQUALS_TO(key_match, value_match).set_to_single_response()
		return self._db.execute_query(query)

	def get_row_match(self, key, value):
		"""Gets a single row match."""
		query = sql.SQLQuery().SELECT_ALL().FROM(self._name).WHERE_EQUALS_TO(key, value)
		return self._db.execute_query(query)[0]

	def get_row_matches(self, key, value):
		"""Get all rows that match with the provided key and value."""
		query = sql.SQLQuery().SELECT_ALL().FROM(self._name).WHERE_EQUALS_TO(key, value)
		return self._db.execute_query(query)

	def get_all_rows(self):
		"""Returns all rows."""
		query = sql.SQLQueryRowsResponse().SELECT_ALL().FROM(self._name)
		return self._db.execute_query(query)

	def create(self):
		"""Creates this table (if it does not exist)."""
		if not self.exists:
			query = sql.SQLQuery().CREATE_TABLE(self._name, self._columns)
			self._db.execute_query(query)
			self._exists = True

	def delete(self):
		"""Deletes this table (if it exists)."""
		if self.exists:
			self._db.execute_query(self._query_drop_table)
			self._exists = False

	@property
	def exists(self):
		"""Returns a boolean indicating if this table exists."""
		if self._exists is None:
			self._exists = self._db.execute_query(self._query_exists)
		return self._exists

	@property
	def many_to_many(self):
		"""Returns any many-to-many table relations."""
		return self._many_to_many_tables

	def set_db(self, db):
		"""Sets the db that this table belongs to."""
		self._db = db

	def get_values_string(self, keys_and_values):
		"""Utility function."""
		s = '('
		num_elements = 0
		for c in self._columns:
			if not c.primary_key:
				s += self._adjust_value(keys_and_values[c.name]) + ','
				num_elements += 1
		if num_elements > 0:
			return s[:-1] + ')'
		else:
			return s + ')'

	def get_column_string(self):
		"""Utility function."""
		s = '('
		for c in self._columns:
			if not c.primary_key:
				s += c.name + ','
		return s[:-1] + ')'

	def _adjust_value(self, key):
		"""Utility function."""
		if type(key) == str:
			return "'" + key + "'"
		return str(key)

	'''__   __                           __   __   ___  __       ___    __        __
	  /  ` /  \ |    |  |  |\/| |\ |    /  \ |__) |__  |__)  /\   |  | /  \ |\ | /__`
	  \__, \__/ |___ \__/  |  | | \|    \__/ |    |___ |  \ /~~\  |  | \__/ | \| .__/ '''

	def add_column(self, table_column):
		"""Adds a column to this table."""
		self._columns.append(table_column)

	def add_column_row_id_alias(self, column_name):
		"""Adds a column which is an alias to row_id."""
		self._primary_key = col.ColumnAbstractionRowIDAlias(column_name, self)
		self.add_column(self._primary_key)

	def add_column_standard_integer(self, column_name):
		"""Utility function to add a normal integer column."""
		self.add_column(col.ColumnAbstractionINTEGER(column_name))

	def add_column_standard_string(self, column_name, unique):
		"""Utility function to add a normal string column."""
		c = col.ColumnAbstractionTEXT(column_name)
		if unique:
			c.unique = True
		self.add_column(c)

	def add_column_standard_boolean(self, column_name):
		"""Utility function to add a normal boolean column."""
		self.add_column(col.ColumnAbstractionINTEGER(column_name))

	def add_column_foreign_key(self, foreign_column):
		"""Utility function to add a foreign key column."""
		self.add_column(col.ColumnAbstractionForeignKey(foreign_column))

	def add_column_datetime(self, column_name):
		"""Utility function to add a datetime column."""
		self.add_column(col.ColumnAbstractionDATETIME(column_name))

