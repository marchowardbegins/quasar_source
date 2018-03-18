# coding=utf-8

"""This module, basic_simulation.py, runs a basic simulation through the data."""


from finance.project_management import finance_projects_builder as finance
from c_processes.c_process import CProcess
from c_processes.c_process_manager import ProcessManager


class BasicSimulation(object):
	"""Handles the running of basic simulations."""

	def __init__(self):
		self._masari_data_files = []
		self._training_files = None
		self._testing_files  = None

	def parse_all_masari_data_files(self):
		"""Gets a list of all the masari data files."""
		self._masari_data_files = sorted(finance.ALL_MASARI_DATA_FILES)
		#training_cutoff_index = int(len(self._masari_data_files) * .7)
		#self._training_files = self._masari_data_files[:training_cutoff_index]
		#self._testing_files = self._masari_data_files[training_cutoff_index:]


		c_process = CProcess(finance.PROJECT_SIMULATION_DATA_FETCHER.executable_file_path, [self._masari_data_files[0]])
		#a, b = c_process.run_process_and_only_get_output()


		simulation_runner = ProcessManager([c_process])
		simulation_runner.run_all_c_processes()


	#def run_training(self):
	#	"""Runs the training for this simulation."""




b = BasicSimulation()
b.parse_all_masari_data_files()
