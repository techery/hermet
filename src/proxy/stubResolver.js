'use strict';

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
  static resolveStubByRequest(stubMap, req) {
    var stubs = Object.values(stubMap);

    return stubs.find(function (stub) {
      if (!stub.predicate) {
        return false;
      }

      return predicateResolver.resolve(stub.predicate, this.makeRequestForCompare(req), "utf8");
    });
  }
}

module.exports = new StubResolver();