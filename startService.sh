#!/bin/bash

check_Status() {

 ps -ef | grep $2 | grep -v grep 2>&1 >> /dev/null

 if [ $?  -eq "0" ]
 then
   #sudo kill -9 `ps -aef | grep $SERVICE | grep -v grep | awk '{print $2}'`

   echo $1 " is already Running"
   return 1

   #`nohup node $NODEFILE >> '$NODEFILELOG' &`
 else

   echo "Starting Service "$1
   return 0
 fi

 }

 run_Service() {

 if [ $2  -eq "0" ]
 then

   echo "Starting Service "$1
   sudo service $1 start

   else
   return 1
 fi

 }


check_Status 'nginx' 'nginx'
run_Service 'nginx' $?

check_Status 'mongodb' 'mongodb'
run_Service 'mongodb' $?