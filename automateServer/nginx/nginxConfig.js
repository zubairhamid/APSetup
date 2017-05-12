(function(){

    var _ = require('lodash');

    var configureNginx = function(){
        this.configFileData = '';
        this.proxyArray = [];
        this.supportedStaticFile = 'css|js|json|html|gif|jpg|png|ico|eot|svg|ttf|woff|woff2|pdf|htm|xml|mp3';
        this.supportedProtocols = 'TLSv1 TLSv1.1 TLSv1.2';
        this.mimeTypes = 'text/plain text/css application/json application/x-javascript text/xml application/xml application/xml+rss text/javascript application/javascript';
        this.supportedCiphers = '"EECDH+AESGCM:EDH+AESGCM:ECDHE-RSA-AES128-GCM-SHA256:AES256+EECDH:DHE-RSA-AES128-GCM-SHA256:AES256+EDH:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-SHA384:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA:ECDHE-RSA-AES128-SHA:DHE-RSA-AES256-SHA256:DHE-RSA-AES128-SHA256:DHE-RSA-AES256-SHA:DHE-RSA-AES128-SHA:ECDHE-RSA-DES-CBC3-SHA:EDH-RSA-DES-CBC3-SHA:AES256-GCM-SHA384:AES128-GCM-SHA256:AES256-SHA256:AES128-SHA256:AES256-SHA:AES128-SHA:DES-CBC3-SHA:HIGH:!aNULL:!eNULL:!EXPORT:!DES:!MD5:!PSK:!RC4"';
    };

    configureNginx.prototype = {
        getNginxDomainFile: function(config){
            var automateFile = this.defineHttpServerBlock.bind(this);
            if(config.https) automateFile = this.defineHttpsServerBlock.bind(this);

            automateFile(config);
            this.defineContentBlock(config);
            this.addLocationBlock(config);
            this.defineServerBlockClose(config);
            return this.configFileData;
        },
        getNginxConfFile: function(config){
            this.configFileData = '#user  nobody;\n\n'+
                'worker_processes  1;\n'+
            'events {\n'+
                'worker_connections  1024;\n'+
            '}\n'+
            'http {\n'+
                'include       mime.types;\n'+
                'default_type  application/octet-stream;\n\n'+
                'log_format  main \'$txid $remote_addr - $remote_user [$time_local] "$request" \'\n'+
                '$status $body_bytes_sent "$http_referer"\n'+
                '"$http_user_agent" "$http_x_forwarded_for";\n\n'+
                'access_log  logs/access.log  main;\n'+
                'sendfile        on;\n'+
                'keepalive_timeout  65;\n'+
                'include /usr/local/nginx/sites-enabled/*;\n'+
                '}';
            return this.configFileData;
        },
        addLocationBlock : function(config){
            var routeConfig = config.location;
            this.location = (typeof routeConfig == "object") ? routeConfig : [];
            for(var i = 0; i < this.location.length; i++ ){
                var nodeProxyName = config.name + i;
                var nodeProxyServerIp = this.checkProxyServerBlock(this.location[i], nodeProxyName);
                var locationConfig = {
                    "nodeProxyName"         : (typeof nodeProxyServerIp != 'object')?nodeProxyName:nodeProxyServerIp.nodeProxyName,
                    "serverPath"            : this.location[i].serverPath,
                    "locationTo"            : this.location[i].route,
                    "nodeProxyIp"           : this.location[i].proxyIp,
                    "x-config"              : this.location[i].serverConfigName,
                    "x-service-from"        : this.location[i].serviceFrom
                };

                if(typeof locationConfig.locationTo == "string" && locationConfig.locationTo != ''){
                    if(!nodeProxyServerIp) this.defineUpStreamBlock(locationConfig);
                    this.defineLocationBlock(locationConfig);
                }
            }
        },
        checkProxyServerBlock: function(config , proxyname){
            var proxyConfig = { ip : config.proxyIp, nodeProxyName : proxyname };
            var foundConfigIp =  _.find(this.proxyArray , { ip: proxyConfig.ip});
            if(!foundConfigIp) this.proxyArray.push(proxyConfig);
            return foundConfigIp;
        },
        defineContentBlock: function(config){
            this.configFileData += 'location ~* \\.(?:'+ this.supportedStaticFile +')$ {\n'+
                'root '+ config.staticContentPath +';\n'+
                'expires  -1;\n'+
                '}\n\n';
        },
        defineLocationBlock: function(config){
            this.configFileData += 'location '+ config.locationTo + ' {\n'+
                'proxy_pass         http://'+ config.nodeProxyName +';\n'+
                'proxy_set_header   X-Real-IP    $remote_addr;\n'+
                'proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;\n'+
                'proxy_http_version 1.1;\n'+
                'proxy_set_header   Upgrade $http_upgrade;\n'+
                'proxy_set_header   Connection "upgrade";\n'+
                'proxy_set_header   X-NginX-Proxy    true;\n'+
                'proxy_set_header   X-Request-Id $txid;\n'+
                'proxy_set_header   X-Auth-Server   true;\n'+
                'proxy_redirect     off;\n'+
                '}\n\n';
        },
        defineUpStreamBlock: function(config){
            this.configFileData = 'upstream '+ config.nodeProxyName+'{\n'+
                'server '+ config.nodeProxyIp +';\n'+
                '}\n\n' +  this.configFileData;
        },
        defineHttpServerBlock: function(config){
            this.configFileData += 'server {\n\n'+
                'listen 80;\n'+
                'server_name '+ config.domainName +' *.'+ config.domainName +';\n\n';
        },
        defineHttpsServerBlock: function(config){
            this.configFileData += 'server {\n'+
                'listen         80;\n'+
                'server_name    '+ config.domainName +' *.'+ config.domainName +';\n'+
                'return 301 https://'+ config.domainName +'$request_uri;\n'+
                '}\n\n'+
                'server {\n\n'+
                'listen                     443 ssl http2;\n'+
                'server_name                '+ config.domainName +' *'+ config.domainName +';\n\n'+
                'ssl                        on;\n'+
                'ssl_certificate            /etc/letsencrypt/live/'+ config.domainName +'/fullchain.pem;\n'+
                'ssl_certificate_key        /etc/letsencrypt/live/'+ config.domainName +'/privkey.pem;\n\n'+
                'ssl_protocols              '+ this.supportedProtocols +';\n'+
                'ssl_ciphers                '+ this.supportedCiphers +';\n\n'+
                'ssl_dhparam                /etc/ssl/certs/dhparam.pem;\n'+
                'ssl_prefer_server_ciphers  on;\n\n'+
                'add_header     Strict-Transport-Security "max-age=63072000; includeSubdomains; preload";\n'+
                'add_header     X-Frame-Options "SAMEORIGIN";\n'+
                'add_header     X-Content-Type-Options nosniff;\n'+
                'add_header     X-XSS-Protection "1; mode=block";\n'+
                'add_header     Referrer-Policy "strict-origin";\n\n';
        },
        defineServerBlockClose: function(config){
            var closeBlock = '';
            if(config.https) closeBlock = 'ssl_session_cache  builtin:1000  shared:SSL:10m;\n\n';
            closeBlock += 'gzip on;\n'+
                'gzip_comp_level 2;\n'+
                'gzip_proxied any;\n'+
                'gzip_types '+ this.mimeTypes +';\n'+
                'gzip_buffers 16 8k;\n'+
                'gzip_vary on;\n'+
                'gzip_static on;\n\n'+
                'brotli on;\n'+
                'brotli_static on;\n'+
                'brotli_types '+ this.mimeTypes +';\n'+
                'brotli_buffers 16 8k;\n'+
                '}';

            this.configFileData += closeBlock;
        },
        responseMessage: function(config){
            var responseSteps = 'Your config file has been created. Please follow the steps\n'+
                'Step1: Copy '+ config.name +' to path /usr/local/nginx/sites-enabled\n'+
                'Step2: Copy nginx.conf to path /usr/local/nginx/conf\n';

            var forHttps = 'Step3: Copy your ssl .pem file to /etc/letsencrypt/live/'+ config.domainName +'/fullchain.pem\n'+
                'Step4: Copy your ssl .key file to /etc/letsencrypt/live/'+ config.domainName +'/privkey.pem\n'+
                'Step5: Please restart nginx for the changes to take effect';

            if(config.https) return console.log(responseSteps + forHttps);
            responseSteps += 'Step3: Please restart nginx for the changes to take effect';
            console.log(responseSteps);
        }
    };

    module.exports = function(){
        return (new configureNginx());
    };
})();