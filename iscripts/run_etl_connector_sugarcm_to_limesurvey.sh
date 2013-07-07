#!/bin/bash
# Iguana 
#
# Roda processo de ETL pata integração entre SugarCRM  e Limesurvey 
#
# Iguana is MPL 2.0  http://www.mozilla.org/MPL/2.0/
#  marcio@ambientelivre.com.br 
#

# credenciais SugarCRM
DATABASE_CRM=sugarcrm
USER_CRM=sugarcrm
PASS_CRM=sugarcrm

# credenciais Limesurvey
DATABASE_LIME=limesurvey
USER_LIME=limesurvey
PASS_LIME=limesurvey


DIR_IGUANA=/opt/iguana



$DIR_IGUANA/idevelopers/lib/data-integration/kitchen.sh -file:$DIR_IGUANA/idevelopers/etl/modules/connectors-plugins/sugarcrm-to-limesurvey/job_sugarcrm_to_limesurvey.kjb -param:database_crm=$DATABASE_CRM -param:user_crm=$USER_CRM -param:pass_crm=$PASS_CRM -param:database_crm=$DATABASE_LIME -param:user_crm=$USER_LIME -param:pass_crm=$PASS_LIME

