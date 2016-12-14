'use strict';

let predicateResolver = require('./predicates'),
    url = require('url'),
    logger = require('../components/logger').proxyLogger;

class StubResolver {

  /**
   * Create simple request. It is need to optimize normalization during comparing.
   *
   * @param req Protocol request
   * @returns Object
   */
  static prepareRequest(req) {
    let urlParts = url.parse(req.url);

    return {
      method: req.method,
      path: urlParts.pathname,
      headers: req.headers
    }
  }

  /**
   * Try to get stub for request param satisfying for the stub predicates
   *
   * @param stubs Map(id, stub)
   * @param req     Protocol request
   * @returns Object
   */
  resolveStubByRequest(stubs, req) {
    return stubs.find(function (stub) {
      let predicates = stub.predicates || [];
      if (!predicates.length) {
        return true;
      }
      return predicates.every(function (predicate) {
        return predicateResolver.resolve(predicate, StubResolver.prepareRequest(req), 'utf8', logger);
      });
    });
  }
}

module.exports = new StubResolver();