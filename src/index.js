import {lcg, lcgIndexed} from './lcg';

const arbitrary = {
  lcg,
  lcgIndexed
};

export default arbitrary;

// TODO: Look into what the right pattern is here
if( module && module.exports ){
    window.arbitrary = arbitrary;
}
