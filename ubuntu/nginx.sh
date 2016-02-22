#!/bin/bash

cd $HOME
sudo apt-get install gcc zlib1g-dev libpcre3 libpcre3-dev libssl-dev git-all make

git clone https://github.com/streadway/ngx_txid.git

wget http://nginx.org/download/nginx-1.9.11.tar.gz
tar -xvzf nginx-1.9.11.tar.gz
cd nginx-1.9.11/
./configure --add-module=$HOME/ngx_txid --with-http_spdy_module --with-http_v2_module
sudo make
sudo make install
sudo cp /usr/local/nginx/sbin/nginx /usr/local/bin/nginx
