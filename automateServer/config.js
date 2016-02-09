module.exports = {
    name: 'autocall',
    https: false,
    domainName: 'autocall.in',
    staticContentPath: '/home/cloudmpower/projects/autocall/public',
    location: [
        {
            "route": '/',
            "proxyIp": '127.0.0.1:3111',
            "serverConfigName": 'autocall',
            "serverPath": '/home/cloudmpower/projects/ibanking',
            "serviceFrom": 'autocallClient'
        },
        {
            "route": '/admin/',
            "proxyIp": '127.0.0.1:3111',
            "serverConfigName": 'expense',
            "serverPath": '/public',
            "serviceFrom": 'autocallAdmin'
        }
    ]
};
