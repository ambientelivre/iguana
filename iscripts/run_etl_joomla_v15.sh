#!/bin/sh
# Iguana 
#
# Iguana is MPL 2.0  http://www.mozilla.org/MPL/2.0/
#  marcio@ambientelivre.com.br 
#

cd /opt/iguana/iscripts

DIR_IGUANA=/opt/iguana
DATABASE_JOOMLA=joomla
USER_JOOMLA=joomla
PASS_JOOMLA=joomla
DIR_IGUANA=/opt/iguana
DATABASE_IGUANA=iguana
USER_IGUANA=iguana
PASS_IGUANA=iguana

$DIR_IGUANA/idevelopers/etl/lib/data-integration/kitchen.sh -file $DIR_IGUANA/idevelopers/etl/modules/joomla/job_joomla.kjb - param:database_joomla=$DATABASE_JOOMLA

# -param:database_crm=$DATABASE_CRM -param:user_crm=$USER_CRM -param:pass_crm=$PASS_CRM -param:database_iguana=$DATABASE_IGUANA -param:user_iguana=$USER_IGUANA -param:pass_iguana=$PASS_IGUANA





