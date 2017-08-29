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


# Define all the pages.
_TEMPLATES_BASE       = 'templates/quasar_web_server/'
TEMPLATE_HELLO_WORLD  = _TEMPLATES_BASE + 'hello_world.html'
TEMPLATE_LOG_FORMULAS = _TEMPLATES_BASE + 'log_formulas.html'
TEMPLATE_QUICK_INFO   = _TEMPLATES_BASE + 'quick_info.html'
TEMPLATE_DIFF_EQ      = _TEMPLATES_BASE + 'differential_equations.html'


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


def GET_quick_info(request):
	"""Returns a temporary page."""
	return render(request, TEMPLATE_QUICK_INFO)


def GET_diff_eq(request):
	"""Returns notes for diff eq."""
	return render(request, TEMPLATE_DIFF_EQ)
