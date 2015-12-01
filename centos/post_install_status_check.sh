#!/bin/bash

node=/usr/local/bin/node
mongod=/usr/bin/mongod
nginx=/usr/local/nginx/sbin/nginx
phantom=/usr/local/bin/phantomjs

mongoFile=3mongo.sh
nodeFile=4node.sh
nginxFile=5nginx.sh
pahntomFile=5pantomjs.sh

check_service(){
    if [ -e $1 ]
        then
            $1 -v >> /dev/null 2>&1
            DeployCheck $? $2 $3
        else
            DeployCheck 1 $2 $3
    fi
}


DeployCheck() {
    MSG='Checking '$2' INSTALLTION'
    EMSG='INFO: run '$3' to INSTALL '$2
    if [ $1 -eq "0" ]
        then
            echo
            echo $MSG' ================================= [OK INSTALLED]'
        else
            echo
            echo $MSG' ================================= [NOT INSTALLED]'
            echo $EMSG
        fi

    return 0
}


check_service $node 'node' $nodeFile

check_service $nginx 'nginx' $nginxFile

check_service $phantom 'phantom'  $pahntomFile

$mongod -version >> /dev/null

DeployCheck $? 'mongodb'  $mongoFile
