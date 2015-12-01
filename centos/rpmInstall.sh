#!/bin/bash

cd $HOME/deployment/rpms

sudo rpm -ivh 'some rpm file name'
checkSatus $?


checkSatus() {
if [ $1 -eq "0" ]
    then
        return 0
    else
        exit 1
fi
}
