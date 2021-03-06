# coding=utf-8

"""This module, system_functions.py, contains useful functions relating to system/os level operations."""

# self.setting_needs_audio_loader

import os


def get_system_environment(key):
	"""Returns the system environment variable's value."""
	value = os.getenv(key, None)
	if value == 'False' or value == 'false':
		return False
	elif value == 'True' or value == 'true':
		return True
	return value



