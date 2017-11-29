# coding=utf-8

"""This module, code_file.py, represents an abstraction layer to a file of code."""

from code_api import lines_of_code as loc
from quasar_source_code.universal_code import useful_file_operations as ufo
# Current 3rd party used to handle minification.
from jsmin import jsmin
from quasar_source_code.universal_code import debugging as dbg

import operator

PYTHON     = 'python'
JAVASCRIPT = 'javascript'


class CodeFileManager(object):
	"""Represents a common group of code files."""

	def __init__(self, code_files):
		self._code_files = code_files

	def get_code_file_by_name(self, file_name):
		"""Returns a CodeFile object if found."""
		for f in self._code_files:
			if file_name in f.file_path:
				return f
		return None

	def get_total_size(self) -> int:
		"""Returns the total size of all the code files as bytes."""
		total_size = 0
		for f in self._code_files:
			total_size += f.file_size
		return total_size

	def get_total_lines_of_code(self) -> int:
		"""Returns the total number of lines of codes."""
		lines_of_code = 0
		for f in self._code_files:
			lines_of_code += f.lines_of_code
		return lines_of_code

	@property
	def number_of_files(self) -> int:
		"""Returns the number of files this manager has."""
		return len(self._code_files)

	def print_data(self):
		"""Prints all relevant data."""
		print('There are ' + str(self.number_of_files) + ' files composed of ' + str(self.get_total_lines_of_code()) + ' lines of code for a total size of ' + str(self.get_total_size()) + ' bytes.')
		#print('Printing all the code files!')
		#for f in self._code_files:
		#	print(f)

	def get_all_code_files_that_have_text(self, text_to_match):
		"""Returns a list of CodeFile objects that also contain at least one occurrence of the text to match."""
		code_files = []
		for cf in self._code_files:
			if cf.has_text(text_to_match):
				code_files.append(cf)
		return code_files

	def sync_universal_constants(self, list_of_groups):
		"""Ensures consistency with universal constant keys and values."""

		# First grab all the files that contain the text 'UNIVERSAL_CONSTANTS_START'.
		files_to_sync = self.get_all_code_files_that_have_text('UNIVERSAL_CONSTANTS_START')

		#print('The files to search are :')
		#for f in files_to_sync:
		#	print(f)

		for g in list_of_groups:
			search_string = 'UNIVERSAL_CONSTANTS_START : ' + g.description

			#print('Search string is')
			#print(search_string)

			# Search each code file.
			for cf in files_to_sync:

				#print(cf)
				#print(cf.has_text(search_string))

				if cf.has_text(search_string):
					cf.sync_for(g)

	def get_all_string_literals(self):
		"""Returns a list of all the string literals found across all files in the manager."""
		all_string_literals = {}
		for cf in self._code_files:
			literals = cf.get_all_string_literals()
			for lit in literals:
				if lit not in all_string_literals:
					all_string_literals[lit] = literals[lit]
				else:
					all_string_literals[lit] += literals[lit]

		# Sort from : https://stackoverflow.com/questions/613183/how-do-i-sort-a-dictionary-by-value

		sorted_x = sorted(all_string_literals.items(), key=operator.itemgetter(1))

		return sorted_x
