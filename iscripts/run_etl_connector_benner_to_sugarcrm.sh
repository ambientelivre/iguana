#!/bin/bash
# Iguana 
#
# Roda processo de ETL do Benner para o SugarCRM 
#
# Iguana is MPL 2.0  http://www.mozilla.org/MPL/2.0/
#  marcio@ambientelivre.com.br 
#

DATABASE_CRM=sugarcrm
USER_CRM=sugarcrm
PASS_CRM=sugarcrm
DIR_IGUANA=/opt/iguana

$DIR_IGUANA/idevelopers/lib/data-integration/kitchen.sh -file:$DIR_IGUANA/idevelopers/modules/sugarcrm/job_benner_erp_to_crm.kjb -param:database_crm=$DATABASE_CRM -param:user_crm=$USER_CRM -param:pass_crm=$PASS_CRM

