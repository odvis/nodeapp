var colorarray = require('../lib/colorarray.js');
describe("colorarray", function() {
  it("creates array", function() {
    a = colorarray.create_colors(2,"bla");
    console.dir(a);
    expect(a.constructor).toBe( Array );
    expect(a.length).toEqual( 3 );
  });
});

