import lcg from './lcg';

const arbitrary = {
  lcg
};

export default arbitrary;

// TODO: Look into what the right pattern is here
if( module && module.exports ){
    window.arbitrary = arbitrary;
}
