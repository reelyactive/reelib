/**
 * Copyright reelyActive 2015-2016
 * We believe in an open Internet of Things
 */


var time = require('./time');
var identifier = require('./identifier');


// Constants
var CSV_HEADER = 'Timestamp,TransmitterID,ReceiverID,RSSI';


/**
 * Return whether the given tiraid is valid or not.
 * @param {Object} tiraid The given tiraid.
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


/**
 * Return whether the given tiraid was transmitted by a reelyActive device.
 * @param {Object} tiraid The given tiraid.
 * @return {boolean} True if a reelyActive transmission, false otherwise.
 */
function isReelyActiveTransmission(tiraid) {

  if(tiraid &&
     tiraid.hasOwnProperty('identifier') &&
     tiraid.identifier.hasOwnProperty('advData')) {
    return tiraid.identifier.advData.complete128BitUUIDs ===
                                               identifier.REELYACTIVE_UUID128;
  }
  return false;
}


/**
 * Return a short string (target < 80 chars) representation of the tiraid.
 * @param {Object} tiraid The given tiraid.
 * @return {String} The tiraid as a short string.
 */
function toShortString(tiraid) {
  
  if(!isValid(tiraid)) {
    return 'Invalid tiraid';
  }

  var output = 'tID: ';
  output += tiraid.identifier.value;
  output += ' rID: ';
  output += tiraid.radioDecodings[0].identifier.value;
  output += ' rssi: ';
  output += tiraid.radioDecodings[0].rssi;
  if(tiraid.radioDecodings.length > 1) {
    output += ' +' + (tiraid.radioDecodings.length - 1) + 'r';
  }
  output += ' at ';
  output += time.toLocalTimeOfDay(tiraid.timestamp);
  return output;
}


/**
 * Return a CSV string representation of the tiraid.
 * @param {Object} tiraid The given tiraid.
 * @return {String} The tiraid as a CSV string.
 */
function toCSVString(tiraid) {
  
  if(!isValid(tiraid)) {
    return null;
  }

  var output = time.toLocalTimeOfDay(tiraid.timestamp) + ',';
  output += tiraid.identifier.value + ',';
  output += tiraid.radioDecodings[0].identifier.value + ',';
  output += tiraid.radioDecodings[0].rssi;
  return output;
}


module.exports.CSV_HEADER = CSV_HEADER;
module.exports.isValid = isValid;
module.exports.isReelyActiveTransmission = isReelyActiveTransmission;
module.exports.toShortString = toShortString;
module.exports.toCSVString = toCSVString;
