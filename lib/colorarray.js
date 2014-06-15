exports.create_colors = function(){

  function hash_string_to_hue ( str ){
    var hash = 0;
    if (str.length == 0) return hash;
    for (i = 0; i < str.length; i++) {
      char = str.charCodeAt(i);
      hash = ((hash<<5)-hash)+char;
      hash = hash & hash; // Convert to 32bit integer
    }
    hash = (hash-22) % 360;
    if( hash < 0 ) { hash = 360 + hash};
    return hash;
  };

  return function(no_steps, colname){
    var color = require('onecolor');
    var colors = [];
    var hue = hash_string_to_hue( colname );
    for(var light = 100; light >= 0; light -= (100 / ( no_steps + 1 ) ) ) {
      colors.push( new color.HSL(hue/360,1,light/100).hex() );
    }
    return colors;
  };
}();
