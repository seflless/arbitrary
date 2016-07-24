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
            })()
        }
    };
