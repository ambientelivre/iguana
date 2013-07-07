#!/bin/sh
### ====================================================================== ###
# Iguana Start Script
# Ambiente Livre Tecnologia
### ====================================================================== ###

cd iserver/lib/pentaho/biserver-ce

sh "stop-pentaho.sh"

# Stop Pentaho Administrator
cd ../administration-console

sh "stop-pac.sh" &

