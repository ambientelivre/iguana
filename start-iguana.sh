#!/bin/sh
### ====================================================================== ###
# Iguana Start Script
# Ambiente Livre Tecnologia
# http://www.ambientelivre.com.br
### ====================================================================== ###


# variaveis
PATH_IGUANA=$PWD


# Verifica se o link simbolico está criado
if [ -s /opt/iguana/iserver/lib/pentaho/biserver-ce/pentaho-solutions ]; then 
   echo "link solution is ok"
else
   # cria link simbolico para altereção de diretório de solutions.
   cd $PATH_IGUANA/iserver/lib/pentaho/biserver-ce
   ln -s $PATH_IGUANA/iserver/iguana-solutions $PATH_IGUANA/iserver/lib/pentaho/biserver-ce/pentaho-solutions
   echo "create simbolic link"
fi


# Start Pentaho BI Server
cd iserver/lib/pentaho/biserver-ce

sh "start-pentaho.sh"

# Start Pentaho Administrator
cd ../administration-console

sh "start-pac.sh" &

