function XorGen(seed) {
  var me = this;

  // Set up generator function.
  me.next = function() {
    var t = me.x ^ (me.x << 11);
    me.x = me.y;
    me.y = me.z;
    me.z = me.w;
    return me.w ^= (me.w >> 19) ^ t ^ (t >> 8);
  };

  function init(me, seed) {
    me.x = seed;
    me.y = 0;
    me.z = 0;
    me.w = 0;
    // Discard an initial batch of 64 values.
    for (var k = 64; k > 0; --k) {
      me.next();
    }
  }

  init(me, seed);
}

var xorGen = new XorGen( Math.floor( Math.random() * Math.pow(2,32) ) );

var algorithms = {
        forEach: function(cb){
            Object.keys(algorithms.techniques).forEach( function(name){
                cb(algorithms.techniques[name], name);
            });
        },
        techniques: {
            /*'tinytmt': function(){
                var val = gen.integer();
                return val;
            },*/
            'arbitrary.lcg': arbitrary.lcg,
            /*'arbitrary.lcgIndexed': (function(){
                var index = 0;
                return function(){
                    index++;
                    return arbitrary.lcgIndexed(index);
                };
            })(),*/
            'Math.random': function (){
                return Math.floor( Math.random() * Math.pow(2,32) );
            },
            'lcg': (function (){
                lcg.setSeed();
                return function(){
                    var val = Math.floor( lcg.rand() * Math.pow(2,32) );
                    return val;
                }
            })(),
            'invwk': (function (){
                invwk.setSeed();
                return function(){
                    var val = Math.floor( invwk.rand() * Math.pow(2,32) );
                    return val;
                }
            })(),
            'mwc': (function (){
                mwc.setSeed();
                return function(){
                    var val = Math.floor( mwc.rand() * Math.pow(2,32) );
                    return val;
                }
            })(),
            'XorGen': function(){
                var val = xorGen.next()*2;
                console.log(val);
                return val;
            }
        }
    };
