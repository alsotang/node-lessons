var assert = chai.assert;
describe('simple test', function () {
  it('should equal 0 when n === 0', function () {
    //main.fibonacci(0).should.equal(0);
    assert.equal(0, window.fibonacci(0))
  });
})