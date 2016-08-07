import Generator from './Generator';

//console.log('Generator');
//console.log(Generator);

const arbitrary = {
  Generator: Generator
};
//console.log('arbitrary');
//console.log(arbitrary);

export default arbitrary;

// TODO: Look into what the right pattern is here
if( typeof window !== 'undefined' ){
    window.arbitrary = arbitrary;
}
if( module && module.exports ){
    module.exports = arbitrary;
}
//console.log('module.exports');
//console.log(module.exports);
