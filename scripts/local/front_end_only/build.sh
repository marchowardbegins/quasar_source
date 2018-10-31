#!/usr/bin/env bash

# Location of this script.
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
# Load utility functions (if needed).
source ${DIR}/../../../scripts/utilities/script_utilities.sh
source ${DIR}/../../../scripts/utilities/docker_utilities.sh
# Go to project base directory.
cd ${DIR}/../../..;

###
SCRIPT_NAME="Front End Only Build Process"
DOCKER_COMPOSE_FILE="docker-compose.dev.front_end_only.build.yml"
###

start_script_with_docker_health_check
# TODO: Dynamic build
#docker_compose_build
docker_compose_up
CODE_MANAGER_BUILD_RESULT=$(docker wait quasar_source_code_manager_1)

if [ ${CODE_MANAGER_BUILD_RESULT} -eq 199 ]; then
    print_red_text "Docker build process failed!"
    docker_compose_down
    finish_script 199
else
    docker_compose_down
    finish_script 0
fi
