#!/bin/bash

# ----------------------------------------------------------------------------
#  __   ___       ___  __       ___     __                __  ___  ___  __  
# / _` |__  |\ | |__  |__)  /\   |  |  /  \ |\ |    |\ | /  \  |  |__  /__` 
# \__> |___ | \| |___ |  \ /~~\  |  |  \__/ | \|    | \| \__/  |  |___ .__/ 
# ----------------------------------------------------------------------------
# LAST_GENERATED : {3.22.2018}

# ----------------------------------------------------------------------------
#          __   __        __                  __   __   __  ___  __  
# |    |  |__) |__)  /\  |__) \ /    |  |\/| |__) /  \ |__)  |  /__` 
# |___ |  |__) |  \ /~~\ |  \  |     |  |  | |    \__/ |  \  |  .__/ 
# ----------------------------------------------------------------------------
PATH_TO_LIBRARY_SCRIPT_UTILITIES=`echo "$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )" | cut -f1-5 -d"/"`/libraries/script_utilities.sh
source ${PATH_TO_LIBRARY_SCRIPT_UTILITIES}
PATH_TO_LIBRARY_CONFIG_READER_SERVER=`echo "$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )" | cut -f1-5 -d"/"`/libraries/config_reader_server.sh
source ${PATH_TO_LIBRARY_CONFIG_READER_SERVER}

# ----------------------------------------------------------------------------
#  __   __   __      __  ___     __  ___       __  ___ 
# /__` /  ` |__) |  |__)  |     /__`  |   /\  |__)  |  
# .__/ \__, |  \ |  |     |     .__/  |  /~~\ |  \  |  
# ----------------------------------------------------------------------------
print_dashed_line_with_text "script{status.sh} start on {${CURRENT_USER}-${HOST_NAME}}."

# ----------------------------------------------------------------------------
#  __        ___  ___ ___         __        ___  __        __  
# /__`  /\  |__  |__   |  \ /    /  ` |__| |__  /  ` |__/ /__` 
# .__/ /~~\ |    |___  |   |     \__, |  | |___ \__, |  \ .__/ 
# ----------------------------------------------------------------------------
terminate_if_not_ubuntu

# ----------------------------------------------------------------------------
#            __           __        ___  __      __   ___ ___ ___          __  
# \  /  /\  |__) |   /\  |__) |    |__  /__`    /__` |__   |   |  |  |\ | / _` 
#  \/  /~~\ |  \ |  /~~\ |__) |___ |___ .__/    .__/ |___  |   |  |  | \| \__> 
# ----------------------------------------------------------------------------
set_variables_for_quasar_server

IS_QUASAR_SERVER_RUNNING=`python3 ${PATH_TO_IS_PROGRAM_RUNNING} ${PYTHON_QUASAR_MANAGE_PATH}`

# ----------------------------------------------------------------------------
#                       __   __   __   ___ 
# |\/|  /\  |  |\ |    /  ` /  \ |  \ |__  
# |  | /~~\ |  | \|    \__, \__/ |__/ |___ 
# ----------------------------------------------------------------------------

if [ "${IS_QUASAR_SERVER_RUNNING}" == "true" ]; then
	echo 'Quasar server is currently running!'
else
	echo 'Quasar server is currently not running!'
fi


# ----------------------------------------------------------------------------
#  __   __   __      __  ___     ___       __  
# /__` /  ` |__) |  |__)  |     |__  |\ | |  \ 
# .__/ \__, |  \ |  |     |     |___ | \| |__/ 
# ----------------------------------------------------------------------------
print_dashed_line_with_text "script{status.sh} end on {${CURRENT_USER}-${HOST_NAME}}."

