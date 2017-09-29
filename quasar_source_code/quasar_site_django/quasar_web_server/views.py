# coding=utf-8

"""This module, views.py, defines server HTTP request responses."""

# Needed to send back a rendered HTML page.
from django.shortcuts import render
# Needed for sending a simple HttpResponse such as a string response.
from django.http import HttpResponse
# Needed for allowing POST requests without requiring a CSRF token.
from django.views.decorators.csrf import csrf_exempt
# Needed to perform HttpRequests to run Locust.
import requests
# Needed for making JsonResponses.
from django.http import JsonResponse
from quasar_source_code.entities.server_side import entity_server as es


# Define all the pages.
_TEMPLATES_BASE         = 'templates/quasar_web_server/'
TEMPLATE_HELLO_WORLD    = _TEMPLATES_BASE + 'hello_world.html'
TEMPLATE_LOG_FORMULAS   = _TEMPLATES_BASE + 'log_formulas.html'
TEMPLATE_QUICK_INFO     = _TEMPLATES_BASE + 'quick_info.html'
TEMPLATE_MATH_220       = _TEMPLATES_BASE + 'math220.html'
TEMPLATE_MATH_310       = _TEMPLATES_BASE + 'math310.html'
TEMPLATE_CS_361         = _TEMPLATES_BASE + 'cs361.html'
TEMPLATE_CS_425         = _TEMPLATES_BASE + 'cs425.html'
TEMPLATE_WEB_SOCKET     = _TEMPLATES_BASE + '/web_socket_server/web_sockets.html'


# Global server.
entity_server = es.EntityServer()


def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


def GET_hello_world(request):
    """Temporary main page."""
    return render(request, TEMPLATE_HELLO_WORLD)


def GET_log_formulas(request):
	"""Returns the HTML page for log formulas."""
	return render(request, TEMPLATE_LOG_FORMULAS)

'''
def GET_quick_info(request):
	"""Returns a temporary page."""

	entity_manager = entity_local_testing.entity_manager

	return render(request, TEMPLATE_QUICK_INFO, {'time_blocks': entity_manager.print_todays_relevant_information()})
'''


def GET_math_220(request):
	"""Returns notes for diff eq."""
	return render(request, TEMPLATE_MATH_220)


def GET_math_310(request):
	"""Returns notes for math 310."""
	return render(request, TEMPLATE_MATH_310)


def GET_cs_361(request):
	"""Returns notes for cs 361."""
	return render(request, TEMPLATE_CS_361)


def GET_cs_425(request):
	"""Returns notes for cs 425."""
	return render(request, TEMPLATE_CS_425)


def GET_web_socket(request):
	"""TEMP test page."""
	return render(request, TEMPLATE_WEB_SOCKET)


# everything above is being organized.

'''  __        __           ___       __
	|__)  /\  /  ` |__/    |__  |\ | |  \
	|__) /~~\ \__, |  \    |___ | \| |__/
'''

# Server response messages.
SERVER_REPLY_INVALID_POST_DATA_ERROR                = HttpResponse('Invalid POST data!')
SERVER_REPLY_INVALID_NUMBER_OF_POST_ARGUMENTS_ERROR = HttpResponse('Invalid number of POST arguments!')
SERVER_REPLY_GENERIC_NO                             = HttpResponse('n')
SERVER_REPLY_GENERIC_YES                            = HttpResponse('y')
SERVER_REPLY_GENERIC_SERVER_ERROR                   = HttpResponse('Server Error!')

# Server utility variables.
USERNAME = 'username'


def check_POST_arguments(arguments, request):
	"""Just a utility function to raise an exception if there is an in-correct match on POST arguments.
	:param arguments: The arguments to check for.
	:param request: Contains information regarding the request sent in.
	:return: Boolean indicating if this threw an exception or not.
	"""
	if len(request.POST) != len(arguments):
		print('Got ' + str(len(request.POST)) + ' number of arguments instead of ' + str(len(arguments)))
		print('They were :')
		for arg in request.POST:
			print(arg)
		return HttpResponse(SERVER_REPLY_INVALID_NUMBER_OF_POST_ARGUMENTS_ERROR)
	for arg in arguments:
		if arg not in request.POST:
			print('Argument not passed in : ' + str(arg) + '.')
			return HttpResponse(SERVER_REPLY_INVALID_POST_DATA_ERROR)
	return None


# Create owner fields.
OWNER_NAME       = 'owner'
OWNER_PASSWORD   = 'password'
OWNER_EMAIL      = 'email'
OWNER_ID         = 'owner_id'
OWNER_MANAGER_ID = 'manager_id'


@csrf_exempt
def POST_login(request):
	"""Handles the POST request for logging in."""
	if check_POST_arguments([USERNAME, OWNER_PASSWORD], request) is not None:
		return check_POST_arguments([USERNAME, OWNER_PASSWORD], request)

	received_username = request.POST[USERNAME]
	received_password = request.POST[OWNER_PASSWORD]

	# TODO : ADD SERVER SIDE CHECK SO THESE PARAMETERS!!!! (currently its only client side)

	print('USERNAME LOGIN : ' + received_username)

	global entity_server
	result = entity_server.is_valid_login_info(received_username, received_password)
	if result == SERVER_REPLY_GENERIC_YES:
		request.session[USERNAME] = received_username
		return SERVER_REPLY_GENERIC_YES
	return result


@csrf_exempt
def POST_create_owner(request):
	"""Handles the POST request for creating a owner."""
	if check_POST_arguments([OWNER_NAME, OWNER_PASSWORD, OWNER_EMAIL], request) is not None:
		return check_POST_arguments([OWNER_NAME, OWNER_ID, OWNER_MANAGER_ID], request)

	received_owner_name = request.POST[OWNER_NAME]
	received_owner_email = request.POST[OWNER_EMAIL]
	received_owner_password = request.POST[OWNER_PASSWORD]

	# TODO : ADD SERVER SIDE CHECKS TO THESE PARAMETERS!!! (currently its only client side)

	print('Creating account : ' + received_owner_name)
	global entity_server
	return entity_server.create_owner(received_owner_name, received_owner_email, received_owner_password)


@csrf_exempt
def POST_load_entity_manager(request):
	"""Handles the POST request to server memory load an entity manager."""
	if check_POST_arguments([USERNAME], request) is not None:
		return check_POST_arguments([USERNAME], request)
	print('Trying to load entity manager for : ' + request.POST[USERNAME])
	global entity_server
	return entity_server.load_entity_manager(request.POST[USERNAME])


@csrf_exempt
def POST_get_entities_for_day(request):
	"""Handles the POST request to get entities for a given day of a given owner."""
	if check_POST_arguments(['day', USERNAME], request) is not None:
		return check_POST_arguments(['day', USERNAME], request)
	global entity_server
	return entity_server.get_entities_for_day(request.POST['day'], request.POST[USERNAME])
