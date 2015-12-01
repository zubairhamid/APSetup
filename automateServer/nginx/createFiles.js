(function(){

    var fs = require('fs');

    var nginxConfig = require('./nginxConfig');

    var serverConfig = require('../config');

    var automateFiles = function(){};

    automateFiles.prototype = {
        createNginxDomainFile : function(){
            this.config = serverConfig;
            this.nginx = nginxConfig();
            var nginxData = this.nginx.getNginxDomainFile(this.config);
            this.fileWriter(this.config.name , nginxData);
        },
        createNginxConfFile : function(){
            this.config = serverConfig;
            this.nginx = nginxConfig();
            var nginxData = this.nginx.getNginxConfFile(this.config);
            this.fileWriter('nginx.conf' , nginxData);
        },
        fileWriter: function(fileName , fileData){
            var that = this;
            fs.writeFile(fileName , fileData , function(err, res){
                that.nginx.responseMessage(that.config);
            });
        }
    };

    module.exports = function(){
        return (new automateFiles());
    };
})();