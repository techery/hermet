'use strict';

module.exports = {
  services: {
    create: {
      name: 'merchant-service-preprod',
      proxyHost:  'create-service.proxy.io:5050',
      targetUrl: 'http://techery-dt-preprod.techery.io:3020'
    },
    update: {
      name: 'merchant-service-preprod',
      proxyHost:  'upate-service.proxy.io:5050',
      targetUrl: 'http://techery-dt-preprod.techery.io:3020'
    },
    delete: {
      name: 'merchant-service-preprod',
      proxyHost:  'delete-service.proxy.io:5050',
      targetUrl: 'http://techery-dt-preprod.techery.io:3020'
    },
    stubCrud: {
      name: 'merchant-service-preprod',
      proxyHost:  'stubs-crud.proxy.io:5050',
      targetUrl: 'http://techery-dt-preprod.techery.io:3020'
    }
  },
  stubs: {
    base: {
      response: 'Ok',
      predicates: [{equals: {field: 'value'}}]
    }
  },
  sessions: {
    create: {
      name: "QA autamation Android",
      ttl: 3000
    },
    update: {
      name: "QA autamation iOS",
      ttl: 3000
    },
    delete: {
      name: "Dump session",
      ttl: 3000
    },
  }
};
