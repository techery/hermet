'use strict';

let predicates = require("./predicates"),
    url = require("url");

class StubResolver {

  /**
   * Create simple request. It is need to optimize normalization during comparing.
   *
   * @param req Protocol request
   * @returns Object
   */
  static makeRequestForCompare(req) {
    let urlParts = url.parse(req.url);

    return {
      method: req.method,
      path: urlParts.pathname
    }
  }

  /**
   * Try to get stub for request param satisfying for the stub predicates
   *
   * @param stubMap Map(id, stub)
   * @param req     Protocol request
   * @returns Object
   */
  resolveStubByRequest(stubMap, req) {
    return Object.keys(stubMap).map(function(stubId) {
        return stubMap[stubId];
      }).find(function(stub) {

      if (!stub.predicate) {
        return false;
      }

      return predicates.resolve(stub.predicate, StubResolver.makeRequestForCompare(req), "utf8");
    });
  }
}

module.exports = new StubResolver();