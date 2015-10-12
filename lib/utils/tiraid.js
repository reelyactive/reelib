/**
 * Copyright reelyActive 2015
 * We believe in an open Internet of Things
 */


var time = require('./time');
var identifier = require('./identifier');


/**
 * Return whether the given tiraid is valid or not.
 * @param {Object} tirad The given tiraid.
 * @return {boolean} True if the given tiraid is valid, false otherwise.
 */
function isValid(tiraid) {

  if(!tiraid) {
    return false;
  }

  // Has timestamp, radioDecodings and identifier?
  if(!(tiraid.hasOwnProperty('timestamp') &&
       tiraid.hasOwnProperty('radioDecodings') &&
       tiraid.hasOwnProperty('identifier'))) {
    return false;
  }

  // timestamp is valid?
  if(!time.isValid(tiraid.timestamp)) {
    return false;
  }

  // radioDecodings is an array of non-zero length?
  if(!(Array.isArray(tiraid.radioDecodings) &&
       (tiraid.radioDecodings.length > 0))) {
    return false;
  }

  // Each radioDecoding has valid rssi and identifier?
  var numberOfDecodings = tiraid.radioDecodings.length;
  for(var cDecoding = 0; cDecoding < numberOfDecodings; cDecoding++) {
    var decoding = tiraid.radioDecodings[cDecoding];
    if(!(decoding.hasOwnProperty('rssi') &&
         decoding.hasOwnProperty('identifier') &&
         (typeof decoding.rssi === 'number') &&
         identifier.isValid(decoding.identifier))) {
      return false;
    }
  }

  // identifier is valid?
  if(!identifier.isValid(tiraid.identifier)) {
    return false;
  }

  return true;
};


module.exports.isValid = isValid;
