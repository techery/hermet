'use strict';

let couchbase = require('./services/CouchbaseWrapper');

couchbase.createPrimaryIndex()
  .then(() => console.log('Index sucessfuly created.'))
  .catch((err) => console.log('Error: ' + err.message));