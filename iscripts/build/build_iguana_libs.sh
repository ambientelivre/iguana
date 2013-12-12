#!/bin/bash
# Iguana 
#
# Cria pacote do iguana para distribuição
#
# Iguana is MPL 2.0  http://www.mozilla.org/MPL/2.0/
#  marcio@ambientelivre.com.br 
#

DIR_IGUANA=/opt/iguana
DIR_IGUANA_BUILD=/opt/iguana-build

# Exclui libs dos pacotes originais do Pentaho não usadas no Iguana para Linux


# Mondrian - Schema Workbench
rm $DIR_IGUANA/idevelopers/olap/lib/schema-workbench/doc -Rfv
rm $DIR_IGUANA/idevelopers/olap/lib/schema-workbench/Schema_Workbench.app -Rfv


# Pentaho Data Integration 
rm $DIR_IGUANA/idevelopers/etl/lib/data-integration/docs -Rfv 
rm $DIR_IGUANA/idevelopers/etl/lib/data-integration/samples -Rfv
rm $DIR_IGUANA/idevelopers/etl/lib/data-integration/simple-jndi -Rfv  
rm $DIR_IGUANA/idevelopers/etl/lib/data-integration/run_kettle_cluster_example.bat
rm $DIR_IGUANA/idevelopers/etl/lib/data-integration/runSamples.sh 
rm $DIR_IGUANA/idevelopers/etl/lib/data-integration/Data\ Integration\ 32-bit.app -Rfv
rm $DIR_IGUANA/idevelopers/etl/lib/data-integration/Data\ Integration\ 64-bit.app -Rfv
rm $DIR_IGUANA/idevelopers/etl/lib/data-integration/generateClusterSchema.sh

# Pentaho Metadata Editor
rm $DIR_IGUANA/idevelopers/metadata/lib/metadata-editor/Metadata\ Editor\ 32-bit.app  -Rfv
rm $DIR_IGUANA/idevelopers/metadata/lib/metadata-editor/Metadata\ Editor\ 64-bit.app  -Rfv
rm $DIR_IGUANA/idevelopers/metadata/lib/metadata-editor/sampledata  -Rfv
rm $DIR_IGUANA/idevelopers/metadata/lib/metadata-editor/samples  -Rfv
rm $DIR_IGUANA/idevelopers/metadata/lib/metadata-editor/simple-jndi  -Rfv

# Weka
rm $DIR_IGUANA/idevelopers/datamining/lib/weka/data  -Rfv
rm $DIR_IGUANA/idevelopers/datamining/lib/weka/doc -Rfv
rm $DIR_IGUANA/idevelopers/datamining/lib/weka/changelogs -Rfv 
rm $DIR_IGUANA/idevelopers/datamining/lib/weka/ExperimenterTutorial.pdf
rm $DIR_IGUANA/idevelopers/datamining/lib/weka/Tutorial.pdf
rm $DIR_IGUANA/idevelopers/datamining/lib/weka/ExplorerGuide.pdf
rm $DIR_IGUANA/idevelopers/datamining/lib/weka/documentation.html
rm $DIR_IGUANA/idevelopers/datamining/lib/weka/documentation.css


# Pentaho Reporting Designer
rm $DIR_IGUANA/idevelopers/reporting/lib/report-designer/docs -Rfv
rm $DIR_IGUANA/idevelopers/reporting/lib/report-designer/samples -Rfv 

# BI Server 
rm $DIR_IGUANA/iserver/iguana-solutions/system/BIRT -Rfv 
rm $DIR_IGUANA/iserver/iguana-solutions/system/jasperreports -Rfv

# Copia Pacotes modificados ( templates , traduções , data e solutions ) 
cp $DIR_IGUANA_BUILD/* -R $DIR_IGUANA/ 



