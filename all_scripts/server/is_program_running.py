# coding=utf-8

"""This module, is_program_running.py, checks if a program is running by command name match."""

# Needed for running subprocesses.
import subprocess
# Needed for parsing arguments.
import argparse
# Needed for perform regax expressions.
import re


if __name__ == '__main__':
	parser       = argparse.ArgumentParser()
	parser.add_argument('service_name')
	args         = parser.parse_args()
	service_name = args.service_name


	output = subprocess.check_output(['ps', '-edaf']).decode('utf-8').split('\n')
	for l in output:
		if 'is_program_running.py' not in l and len(l) > 0:
			content = re.findall(r'\S+', l)

			uid   = content[0]
			pid   = content[1]
			ppid  = content[2]
			c     = content[3]
			stime = content[4]
			tty   = content[5]
			time  = content[6]
			cmd   = content[6:]

			print(pid)
			for command in cmd:
				print(command)
			print('-----')


	#output       = run_bash_command_and_get_output(['top', '-c', '-n', '1', '-b']).split('\n')


	#for o in output:
	#	if 'is_program_running.py' not in o:
	#		if command_text in o:
	#			print('true')
	#			exit()
	#print('false')

# Example usage : value=$(python3 is_program_running.py 'runserver')
# test push
