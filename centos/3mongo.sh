#!/bin/bash
echo 'Starting the Mongodb Install'

repo=$HOME/deployment/10gen.repo
done=10gen.repo

if [ -e $repo ]
then

sudo cp $repo /etc/yum.repos.d/$done
else
 echo $repo' file not found ' ; exit 1;
fi

echo 'Installing Mongodb'
sudo yum -y install mongo-10gen mongo-10gen-server
