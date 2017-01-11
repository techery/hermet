export default {
    service: {
        proxyHost: {
            notEmpty: {errorMessage: 'proxyHost is a required param'},
            isUniqueProxyRule: {errorMessage: 'Proxy service setting for this host [%0] is already exist'}
        },
        targetUrl: {
            notEmpty: true,
            errorMessage: 'targetUrl is a required param'
        }
    }
};
