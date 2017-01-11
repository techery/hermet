import {serviceRepository} from '../container';

export default {
    customValidators: {
        isArray: (value: any): boolean => {
            return Array.isArray(value);
        },
        isUniqueProxyRule: function (value: any): any {
            if (!value) {
                return false;
            }

            return new Promise(function (resolve: Function, reject: Function): any {
                serviceRepository.getByProxyHost(value).then(proxyRule => {
                    console.log(value, proxyRule);
                    if (!proxyRule) {
                        resolve();
                    }
                    reject();
                });
            });
        }
    }
};
