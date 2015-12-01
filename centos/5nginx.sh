#!/bin/bash
clear
mkdir -R $HOME/installer
cd $HOME/installer 

sudo yum -y install gcc gcc-c++ openssl-devel pcre-devel zlib-devel make

wget https://www.openssl.org/source/openssl-1.0.2.tar.gz
tar -zxvf openssl-1.0.2.tar.gz

wget http://nginx.org/download/nginx-1.6.2.tar.gz
tar -xvzf nginx-1.6.2.tar.gz

cd nginx-1.6.2/
./configure --add-module=$HOME/installer/ngx_txid --with-http_spdy_module --with-http_ssl_module --with-openssl=$HOME/installer/openssl-1.0.2
sudo make
sudo make install

if [ $? -eq "0" ]
    then
        echo
        echo "Nginx Install Complete"
        echo
        echo "Setting up Nginx "

        cd $HOME/deployment

        sudo mkdir -p /usr/local/nginx/sites-enabled
        sudo mkdir -p /usr/local/nginx/ssl

        sudo cp nginx.conf /usr/local/nginx/conf/nginx.conf
        sudo cp nginx /etc/init.d/nginx
        sudo chmod 755 /etc/init.d/nginx

        sudo cp ibanking /usr/local/nginx/sites-enabled/ibanking

        sudo cp mycert.key /usr/local/nginx/ssl/mycert.key
        sudo cp mycert.pem /usr/local/nginx/ssl/mycert.pem

        exit 0
    else

        exit 1
fi
