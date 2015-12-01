#!/bin/bash
clear
echo downloading Latest Node!!
cd $HOME
echo
ls -al
echo
wget http://nodejs.org/dist/v0.10.36/node-v0.10.36.tar.gz
echo
tar zxf node-v0.10.36.tar.gz
echo
cd node-v0.10.36
sudo ./configure
sudo make
echo make sucess!!

sudo make install
