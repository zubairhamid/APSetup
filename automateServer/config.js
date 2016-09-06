module.exports = {
    name: 'jollywell',
    https: true,
    domainName: 'jollywell.in',
    staticContentPath: '/root/projects/jollywell/public',
    location: [
        {
            "route": '/',
            "proxyIp": '127.0.0.1:3111',
            "serverConfigName": 'autocall',
            "serverPath": '/home/cloudmpower/projects/ibanking',
            "serviceFrom": 'autocallClient'
        }
    ]
};
