#!/bin/bash

cd $HOME
sudo apt-get install gcc zlib1g-dev libpcre3 libpcre3-dev libssl-dev git-all make

git clone https://github.com/streadway/ngx_txid.git

wget http://nginx.org/download/nginx-1.9.12.tar.gz
tar -xvzf nginx-1.9.12.tar.gz
cd nginx-1.9.12/
./configure --add-module=$HOME/ngx_txid --with-http_ssl_module --with-http_v2_module
sudo make
sudo make install

cd /etc/ssl/certs && openssl dhparam -out dhparam.pem 2048
