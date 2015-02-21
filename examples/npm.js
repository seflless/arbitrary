var arbitrary = require('../arbitrary.js'),
    i, line = '';

for(i = 0; i<10; i++){
  line+= arbitrary.float() + ' ';
}

console.log(line);