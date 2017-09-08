# coding=utf-8

"""This module, consumers.py, is used to handle basic connections between the client and server."""

from channels import Group
from channels.sessions import channel_session


import threading


class QuasarServer(object):
	"""Temporary test server code."""

	def __init__(self):
		self._users = []
		self._number_of_connected_users = 0

	def user_joined(self):
		self._number_of_connected_users += 1

	def user_left(self):
		self._number_of_connected_users -= 1

	def run_server(self):
		# Message positions of all players to all players.
		if self._number_of_connected_users > 0:
			y = 2
			#print('Pinging players!')
			#Group('users').send({
			#	"text": 'Pinging the players!',
			#})
		threading.Timer(5, self.run_server).start()


server = QuasarServer()
server.run_server()


@channel_session
def ws_connect(message):

	# Accept connection.
	message.reply_channel.send({'accept': True})

	server.user_joined()

	print(message.reply_channel)
	print(message)

	Group('users').add(message.reply_channel)


@channel_session
def ws_message(message):
	#print('JUST GOT THE MESSAGE : ' + str(message))
	Group('users').send({
		"text": "[user] %s" % message.content['text'],
	})


@channel_session
def ws_disconnect(message):

	server.user_left()

	Group('users').discard(message.reply_channel)







