# coding=utf-8

"""This module, build_nexus_local.py, builds NexusLocal."""

from libraries.universal_code import output_coloring as oc
from libraries.code_api.project_abstraction.project_component import ProjectComponent
from libraries.code_api.source_file_abstraction.code_directories.code_directory import CodeDirectory
from libraries.code_api.code_manager.build_step import BuildStep

from applications.code_manager.layer_domain.nexus_local import nexus_local_builder_db as db

from applications.code_manager.layer_applications import javascript_manager as jsm


class NexusLocalBuilder(object):
	"""Builds NexusLocal."""

	def __init__(self):
		self.db = db.NexusLocalBuilderDB()

		self.is_build_nexus_local = True
		self.is_build_quasar      = False

		self.build_steps = []

		# HTML
		self.html = ProjectComponent('nexus_local_html')
		self.html.add_extensions_to_ignore(['.min', '.gz', '.min.gz'])
		self.html.add_base_code_directory(CodeDirectory('/quasar/assets/front_end/html'))
		self.html.set_generated_file_path('/quasar/generated_output/web_assets/')
		self.html.load_all_content()

		# CSS
		self.css = ProjectComponent('nexus_local_css')
		self.css.add_extensions_to_ignore(['.min', '.gz', '.min.gz'])
		self.css.add_base_code_directory(CodeDirectory('/quasar/assets/front_end/css'))
		self.css.set_generated_file_path('/quasar/generated_output/web_assets/')
		self.css.load_all_content()

		# JS Libraries
		self.js_libraries = ProjectComponent('nexus_local_js_libraries')
		self.js_libraries.add_extensions_to_ignore(['.gz', '.min.gz', ''])
		self.js_libraries.add_base_code_directory(CodeDirectory('/quasar/libraries/front_end/js/third_party'))
		self.js_libraries.load_all_content()

		# Assets
		self.assets = ProjectComponent('nexus_local_assets')
		self.assets.add_base_code_directory(CodeDirectory('/quasar/assets/front_end/shaders/'))
		self.assets.load_all_content()

		# JS
		self.javascript_manager = jsm.JavascriptManager(self)
		self.js = self.javascript_manager.load_all_content()

		# Websocket server
		self.web_server = ProjectComponent('nexus_local_websocket_server')
		self.web_server.add_extensions_to_ignore(['', '.py'])
		self.web_server.add_base_code_directory('/quasar/applications/nexus_courier')
		self.web_server.load_all_content()

		# Builds steps
		self.build_steps.append(BuildStep('html', self._build_html))
		self.build_steps.append(BuildStep('css', self._build_css))
		self.build_steps.append(BuildStep('js_libs', self._build_js_libraries))
		self.build_steps.append(BuildStep('js', self._build_js))
		self.build_steps.append(BuildStep('web', self._build_websocket_server))

	def build(self):
		"""Builds Nexus Local."""
		oc.print_ascii_yellow('building nexus local')

		for step in self.build_steps:
			status = step.run_step()
			if status is not None:
				print('RETURNING {' + str(status) + '}')
				return status

		#self.db.print_all_data()

	def _build_websocket_server(self):
		"""Builds the websocket server."""
		any_file_updated = False
		all_files = self.web_server.all_files
		for f in all_files:
			print('Looking at {' + str(f) + '}')
			just_cached, needs_update = self.db.cache_file(f)
			if just_cached or needs_update:
				any_file_updated = True

		if any_file_updated:
			print('BUILD WEBSOCKET SERVER!')
			#self.db.print_all_data()
			return 222

	def _build_css(self):
		"""Builds the CSS files."""
		self._minify_then_gzip(self.css.all_files, self.css._generated_files_path)

	def _build_html(self):
		"""Builds the HTML files."""
		self._minify_then_gzip(self.html.all_files, self.html._generated_files_path)

	def _build_js_libraries(self):
		"""Builds the JS library files."""
		self._gzip(self.js_libraries.all_files)

	def _build_js(self):
		"""Builds the JS files."""
		f = self.javascript_manager.build_js(self.assets)
		self._minify_then_gzip([f], self.js._generated_files_path)

	def _gzip(self, files):
		"""Utility function."""
		for f in files:
			just_cached, needs_update = self.db.cache_file(f)
			if just_cached or needs_update:
				if just_cached:
					oc.print_data(str(f) + ' was cached.')
				else:
					oc.print_data(str(f) + ' was updated.')
				gzip_cached = self.db.cache_file_regular_gzip(f, needs_update)
				if gzip_cached:
					oc.print_data(str(f) + ' was gzipped.')
				else:
					oc.print_data(str(f) + ' is already gzipped.')
			else:
				oc.print_data(str(f) + ' is already cached.')

	def _minify_then_gzip(self, files, generated_files_path):
		"""Utility function."""
		for f in files:
			just_cached, needs_update = self.db.cache_file(f)
			if just_cached or needs_update:
				if just_cached:
					oc.print_data(str(f) + ' was cached.')
				else:
					oc.print_data(str(f) + ' was updated.')
				minified_cached, gf_id, full_path = self.db.cache_file_minified(f, generated_files_path, needs_update)
				if not minified_cached or needs_update:
					oc.print_data(str(f) + ' was minified.')
					gzip_cached = self.db.cache_file_gzipped(gf_id, full_path, needs_update)
					if gzip_cached:
						oc.print_data(str(f) + ' was gzipped.')
					else:
						oc.print_data(str(f) + ' is already gzipped.')
				else:
					oc.print_data(str(f) + ' is already minified.')
			else:
				oc.print_data(str(f) + ' is already cached.')


'''__   __   __     __  ___     ___      ___  __          __   __         ___
  /__` /  ` |__) | |__)  |     |__  |\ |  |  |__) \ / __ |__) /  \ | |\ |  |
  .__/ \__, |  \ | |     |     |___ | \|  |  |  \  |     |    \__/ | | \|  |  '''
builder      = NexusLocalBuilder()
build_status = builder.build()

if build_status is None or build_status == 0:
	exit(0)
else:
	exit(build_status)


