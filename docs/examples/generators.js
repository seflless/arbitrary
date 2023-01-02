
var generators = {
        forEach: function(cb){
            Object.keys(generators.techniques).forEach( function(name){
                cb(generators.techniques[name], name);
            });
        },
        techniques: {
            'arbitrary.lcg': (function (){
                var generate = new arbitrary.default.Generator();
                return function(){
                    var val = generate.next.integer();
                    return val;
                }
            })(),
            'Math.random': function (){
                return Math.floor( Math.random() * Math.pow(2,32) );
            }
        }
    };
