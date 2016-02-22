#!/bin/bash

cd $HOME
sudo apt-get install g++ python libkrb5-dev

wget https://nodejs.org/dist/v4.2.2/node-v4.2.2.tar.gz
tar zxf node-v4.2.2.tar.gz
cd node-v4.2.2
sudo ./configure
sudo make
sudo make install
