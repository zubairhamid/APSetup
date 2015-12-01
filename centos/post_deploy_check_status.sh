#!/bin/bash

nginx='nginx'
mongodb='mongodb'
node='node'

errorMsg="INFO: you can go to $HOME/deployment and run sh startService.sh"
nodeMsg="INFO: you can go to $HOME/projects/ibanking and run sh nodeService.sh"

check_Service() {

ps -ef | grep $1 | grep -v grep 2>&1 >> /dev/null

message $? $1
errorCheckMsg $? $2
}

message() {
        if [ $1 -eq "0" ]
             then
                 echo
                 echo $2  ' ================================================== [Running]'
                 return 0
             else
                 echo
                 echo $2  ' ================================================== [Not Running]'
                 return 1
        fi
}

errorCheckMsg() {
        eval errString="$2"

        if [ $1 -eq  "1" ]
            then
                echo "${errString}"
        fi
}

check_Service $nginx "\${errorMsg}"
check_Service $mongodb "\${errorMsg}"
check_Service $node "\${nodeMsg}"