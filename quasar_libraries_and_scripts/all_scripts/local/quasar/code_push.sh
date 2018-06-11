#!/bin/bash

# ----------------------------------------------------------------------------
#  __   ___       ___  __       ___     __                __  ___  ___  __  
# / _` |__  |\ | |__  |__)  /\   |  |  /  \ |\ |    |\ | /  \  |  |__  /__` 
# \__> |___ | \| |___ |  \ /~~\  |  |  \__/ | \|    | \| \__/  |  |___ .__/ 
# ----------------------------------------------------------------------------
# LAST_GENERATED : {4.6.2018}

# ----------------------------------------------------------------------------
#          __   __        __                  __   __   __  ___  __  
# |    |  |__) |__)  /\  |__) \ /    |  |\/| |__) /  \ |__)  |  /__` 
# |___ |  |__) |  \ /~~\ |  \  |     |  |  | |    \__/ |  \  |  .__/ 
# ----------------------------------------------------------------------------
PATH_TO_LIBRARY_SCRIPT_UTILITIES=`echo "$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )" | cut -f1-6 -d"/"`/libraries/script_utilities.sh
source ${PATH_TO_LIBRARY_SCRIPT_UTILITIES}
PATH_TO_LIBRARY_CONFIG_READER_LOCAL=`echo "$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )" | cut -f1-6 -d"/"`/libraries/config_reader_local.sh
source ${PATH_TO_LIBRARY_CONFIG_READER_LOCAL}

# ----------------------------------------------------------------------------
#  __   __   __      __  ___     __  ___       __  ___ 
# /__` /  ` |__) |  |__)  |     /__`  |   /\  |__)  |  
# .__/ \__, |  \ |  |     |     .__/  |  /~~\ |  \  |  
# ----------------------------------------------------------------------------
print_dashed_line_with_text "script{code_push.sh} start on {${CURRENT_USER}-${HOST_NAME}}."

# ----------------------------------------------------------------------------
#  __        ___  ___ ___         __        ___  __        __  
# /__`  /\  |__  |__   |  \ /    /  ` |__| |__  /  ` |__/ /__` 
# .__/ /~~\ |    |___  |   |     \__, |  | |___ \__, |  \ .__/ 
# ----------------------------------------------------------------------------
terminate_if_ubuntu
terminate_if_sudo
if [ "$#" -ne 2 ]; then
	terminate_script "The script{code_push.sh} requires exactly{2} arguments. They are [commit_message, restart_servers]."
fi

# ----------------------------------------------------------------------------
#            __           __        ___  __      __   ___ ___ ___          __  
# \  /  /\  |__) |   /\  |__) |    |__  /__`    /__` |__   |   |  |  |\ | / _` 
#  \/  /~~\ |  \ |  /~~\ |__) |___ |___ .__/    .__/ |___  |   |  |  | \| \__> 
# ----------------------------------------------------------------------------
set_variables_for_quasar_connection

set_variables_for_quasar_maintenance
set_variables_for_quasar_project_setup


# ----------------------------------------------------------------------------
#                       __   __   __   ___ 
# |\/|  /\  |  |\ |    /  ` /  \ |  \ |__  
# |  | /~~\ |  | \|    \__, \__/ |__/ |___ 
# ----------------------------------------------------------------------------

if output=$(git status --porcelain) && [ -z "$output" ]; then
	# Working directory clean
	print_script_text "The working directory is clean so no commit will be made."
else
	# First generate the production version of Quasar.
	${PATH_TO_LOCAL_PYTHON3} ${PATH_TO_QUASAR_MAINTENANCE} ${QUASAR_MAINTENANCE_FLAG_CREATE_PRODUCTION}

	# There are uncommitted changes.
	print_script_text "Pushing the code changes."

    print_dotted_line
    # This will add all files, new files, changes, and removed files.
    git add -A;
    git commit -m "$1";
    git push --force;
    print_dotted_line



	if [ $2 -eq 0 ]; then
		print_script_text "Skipping server checks!"

		# Quasar server + database.
        ssh -i ${QUASAR_PEM_PATH} ${QUASAR_USER}@${QUASAR_IP} -p ${QUASAR_PORT} << HERE
# Update the sever code.
${UPDATE_SERVER_CODE_SERVER};
HERE


	else
		print_script_text "Performing server checks!"

		# Quasar server + database.
        ssh -i ${QUASAR_PEM_PATH} ${QUASAR_USER}@${QUASAR_IP} -p ${QUASAR_PORT} << HERE
# Update the sever code.
${UPDATE_SERVER_CODE_SERVER};
# Make sure Pymongo is running.
${HEALTH_CHECK_SERVER};
print_script_text "Performing server checks!"
# Terminate both the quasar and entity server.
${QUASAR_TERMINATE_SERVER};
${ENTITY_TERMINATE_SERVER};
# Run (in background) both the quasar and entity server.
${ENTITY_RUN_IN_BACKGROUND_SERVER} &> ${SERVER_LOGS}/entity.logs &
disown;
sleep 2;
${QUASAR_RUN_IN_BACKGROUND_SERVER} &> ${SERVER_LOGS}/quasar.logs &
disown;
HERE

	# Give the server at least 2 seconds to start up.
	sleep 2;

	# Now restart the Quasar server + ensure that it is running.
	${PATH_TO_LOCAL_PYTHON3} ${CLIENT_SIDE_SERVER_HEALTH_CHECK}
	fi
fi


# ----------------------------------------------------------------------------
#  __   __   __      __  ___     ___       __  
# /__` /  ` |__) |  |__)  |     |__  |\ | |  \ 
# .__/ \__, |  \ |  |     |     |___ | \| |__/ 
# ----------------------------------------------------------------------------
print_dashed_line_with_text "script{code_push.sh} end on {${CURRENT_USER}-${HOST_NAME}}."

