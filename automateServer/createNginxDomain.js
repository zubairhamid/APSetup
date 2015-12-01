(function(){
    var nginxAutomate = require('./nginx/createFiles')();
    nginxAutomate.createNginxDomainFile();
})();