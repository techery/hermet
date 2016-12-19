'use strict';

var assert = require('assert'),
  inherit = require('../../../proxy/util/inherit');

describe('inherit', function () {
  describe('#from', function () {
    it('should inherit prototype', function () {
      var obj = inherit.from({prototypeKey: 'prototypeValue'});
      assert.strictEqual(obj.prototypeKey, 'prototypeValue');
    });

    it('should have both new keys and prototype keys', function () {
      var obj = inherit.from({prototypeKey: 'prototypeValue'}, {ownKey: 'ownValue'});
      assert.strictEqual(obj.prototypeKey, 'prototypeValue');
      assert.strictEqual(obj.ownKey, 'ownValue');
    });

    it('should shadow prototype with own keys', function () {
      var obj = inherit.from({key: 'prototypeValue'}, {key: 'ownValue'});
      assert.strictEqual(obj.key, 'ownValue');
    });

    it('should call new on function supers', function () {
      function F() {
        this.key = 'value';
      }

      var obj = inherit.from(F);

      assert.strictEqual(obj.key, 'value');
    });
  });
});
