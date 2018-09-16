# coding=utf-8

"""This module, css_file.py, provides an abstraction to css code files."""


#from code_api.code_abstraction.code_chunk import CodeChunk
from libraries.universal_code import useful_file_operations as ufo
from libraries.code_api.source_file_abstraction.code_files.reducable.minifiable import Minifiable
from libraries.code_api.source_file_abstraction.code_files.code_file import *
from csscompressor import compress


class LoadedCSSFile(LoadedCodeFile, Minifiable):
	"""Represents a single css file."""

	def __init__(self, file_name, file_extensions=None):
		LoadedCodeFile.__init__(self, FILE_TYPE_CSS, file_name, file_extensions)
		Minifiable.__init__(self)
		self.set_minification_function(compress)
