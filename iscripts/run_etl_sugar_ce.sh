#!/bin/sh
# Iguana 
#
# Iguana is MPL 2.0  http://www.mozilla.org/MPL/2.0/
#  marcio@ambientelivre.com.br 
#

#Load variables of iguana.config

cd /opt/iguana/iscripts

DIR_IGUANA=$(cat iguana.config  | grep DIR_IGUANA | cut -d= -f2)

# Database Iguana
DATABASE_HOST_IGUANA=$(cat iguana.config  | grep DATABASE_HOST_IGUANA | cut -d= -f2)
PORT_IGUANA=$(cat iguana.config  | grep PORT_IGUANA | cut -d= -f2)
USER_IGUANA=$(cat iguana.config  | grep USER_IGUANA | cut -d= -f2)
PASS_IGUANA=$(cat iguana.config  | grep PASS_IGUANA | cut -d= -f2)

# Database SugarCRM
DATABASE_SUGARCRM=$(cat iguana.config  | grep DATABASE_SUGARCRM | cut -d= -f2)
DATABASE_HOST_SUGARCRM=$(cat iguana.config  | grep DATABASE_HOST_SUGARCRM | cut -d= -f2)
PORT_SUGARCRM=$(cat iguana.config  | grep PORT_SUGARCRM | cut -d= -f2)
USER_SUGARCRM=$(cat iguana.config  | grep USER_SUGARCRM | cut -d= -f2)
PASS_SUGARCRM=$(cat iguana.config  | grep PASS_SUGARCRM | cut -d= -f2)

# Exec ETL - Data Integration for Iguana 

$DIR_IGUANA/idevelopers/etl/lib/data-integration/kitchen.sh -file $DIR_IGUANA/idevelopers/etl/modules/sugarcrm/job_iguana_sugar_ce.kjb -param:DATABASE_SUGARCRM=$DATABASE_SUGARCRM -param:USER_SUGARCRM=$USER_SUGARCRM -param:PASS_SUGARCRM=$PASS_SUGARCRM -param:DATABASE_IGUANA=$DATABASE_IGUANA -param:USER_IGUANA=$USER_IGUANA -param:PASS_IGUANA=$PASS_IGUANA -param:DATABASE_HOST_IGUANA=$DATABASE_HOST_IGUANA -param:DATABASE_HOST_SUGARCRM=$DATABASE_HOST_SUGARCRM -param:PORT_IGUANA=$PORT_IGUANA -param:PORT_SUGARCRM=$PORT_SUGARCRM





