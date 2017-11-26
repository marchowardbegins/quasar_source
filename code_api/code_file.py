# coding=utf-8

"""This module, code_file.py, represents an abstraction layer to a file of code."""

from code_api import lines_of_code as loc
from quasar_source_code.universal_code import useful_file_operations as ufo
# Current 3rd party used to handle minification.
from jsmin import jsmin


class CodeFile(object):
	"""Represents a single file that contains lines of code."""

	def __init__(self, file_path):
		self._file_path = file_path
		self._file_size = ufo.get_file_size_in_bytes(self._file_path)
		self._lines_of_code = loc.get_lines_of_code_from_file(self._file_path)

	@property
	def file_size(self):
		"""Returns the size of this file in bytes."""
		return self._file_size


class CodeFileJavaScript(CodeFile):
	"""Represents a single JavaScript file."""

	def __init__(self, file_path):
		super().__init__(file_path)
		self._minified_js = None
		self._minified_file_path = self._file_path.replace('.js', '.min.js')

	def get_minified_javascript_text(self):
		"""Gets the minified version of the Javascript file provided."""
		if self._minified_js is None:
			with open(self._file_path) as js_file:
				self._minified_js = jsmin(js_file.read())
		return self._minified_js

	def create_minified_version(self):
		"""Creates the minified version of this Javascript file."""
		ufo.create_file_or_override(self.get_minified_javascript_text(), self._minified_file_path)

'''
def produce_quasar_minified_javascript_files():
	"""Produces the *.min.js files."""
	all_javascript_files = _get_all_javascript_files()

	total_original_size = 0
	total_reduced_size  = 0

	for f in all_javascript_files:
		//minified_file_path = f.replace('.js', '.min.js')
		total_original_size += f.file_size

		#print('Currently parsing {' + str(file_name) + '} - size{' + str(original_file_size) + '}')

		m = get_minifed_javascript_text(f)
		ufo.create_file_or_override(m, minified_file_path)
		minified_file_size = ufo.get_file_size_in_bytes(minified_file_path)

		#print('Created {' + ufo.get_file_basename(minified_file_path) + '} - size{' + str(minified_file_size) + '}')
		total_reduced_size += minified_file_size

		#print()

	print('Total size before : ' + str(total_original_size))
	print('New size : ' + str(total_reduced_size))
	print('Size reduction % : ' + str(1.0 - (total_reduced_size / total_original_size)))

'''