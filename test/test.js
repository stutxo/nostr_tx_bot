/* eslint-disable no-undef */
//mock test for deployment testing
import { equal } from 'assert';

describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      equal([1, 2, 3].indexOf(10), -1);
    });
  });
});
