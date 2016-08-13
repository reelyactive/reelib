/**
 * Copyright reelyActive 2015-2016
 * We believe in an open Internet of Things
 */


var time = require('./time');
var identifier = require('./identifier');


// Constants
var CSV_HEADER = 'Timestamp,DeviceID,ReceiverID,RSSI';


/**
 * Return the time of the tiraid.
 * @param {Object} tiraid The given tiraid.
 * @return {Number} The time as the number of milliseconds since the epoch.
 */
function getTimestamp(tiraid) {

  if(tiraid && tiraid.hasOwnProperty('timestamp')) {
    return time.toTimestamp(tiraid.timestamp);
  }
  return null;

}


/**
 * Return the device identifier of the tiraid.
 * @param {Object} tiraid The given tiraid.
 * @return {String} The device identifier.
 */
function getDeviceId(tiraid) {

  if(tiraid && tiraid.hasOwnProperty('identifier')) {
    return identifier.toIdentifierString(tiraid.identifier);
  }
  return null;

}


/**
 * Return the identifier of the strongest receiver of the tiraid.
 * @param {Object} tiraid The given tiraid.
 * @return {String} The identifier of the strongest receiver.
 */
function getReceiverId(tiraid) {

  if(tiraid &&
     tiraid.hasOwnProperty('radioDecodings') &&
     Array.isArray(tiraid.radioDecodings) &&
     (tiraid.radioDecodings.length > 0)) {
    return identifier.toIdentifierString(tiraid.radioDecodings[0].identifier);
  }
  return null;

}


/**
 * Return all association identifiers embedded in the identifier payload of
 * the tiraid.
 * @param {Object} tiraid The given tiraid.
 * @return {Array} The association identifiers.
 */
function getAssociationIds(tiraid) {
  var associationIds = [];

  if(tiraid && tiraid.hasOwnProperty('identifier')) {

    // BLE Advertiser Data (GAP)
    var advDataExists = tiraid.identifier.hasOwnProperty("advData");
    if(advDataExists) {
      var advData = tiraid.identifier.advData;

      // Complete 128-bit UUIDs
      if(advData.complete128BitUUIDs) {
        associationIds.push(advData.complete128BitUUIDs);
      }
      // Non-Complete 128-bit UUIDs
      if(advData.nonComplete128BitUUIDs) {
        associationIds.push(advData.nonComplete128BitUUIDs);
      }
      // Complete 16-bit UUIDs
      if(advData.complete16BitUUIDs &&
         (typeof(advData.complete16BitUUIDs) === 'string')) {
        for(var cIndex = 0; cIndex < advData.complete16BitUUIDs.length;
            cIndex += 4) {
          associationIds.push(advData.complete16BitUUIDs.substr(cIndex, 4));
        }
      }
      // Non-Complete 16-bit UUIDs
      if(advData.nonComplete16BitUUIDs &&
         (typeof(advData.nonComplete16BitUUIDs) === 'string')) {
        for(var cIndex = 0; cIndex < advData.nonComplete16BitUUIDs.length;
            cIndex += 4) {
          associationIds.push(advData.nonComplete16BitUUIDs.substr(cIndex, 4));
        }
      }
      // Company Identifier Codes
      if(advData.manufacturerSpecificData &&
         advData.manufacturerSpecificData.companyIdentifierCode) {
        associationIds.push(
                       advData.manufacturerSpecificData.companyIdentifierCode);
      }
      // iBeacon
      if(advData.manufacturerSpecificData &&
         advData.manufacturerSpecificData.iBeacon) {
        associationIds.push(advData.manufacturerSpecificData.iBeacon.uuid +
                            advData.manufacturerSpecificData.iBeacon.major +
                            advData.manufacturerSpecificData.iBeacon.minor);
      }
    }

  }
  return associationIds;

}


/**
 * Return the RSSI of the strongest receiver of the tiraid.
 * @param {Object} tiraid The given tiraid.
 * @return {Number} The RSSI of the strongest receiver.
 */
function getRSSI(tiraid) {

  if(tiraid &&
     tiraid.hasOwnProperty('radioDecodings') &&
     Array.isArray(tiraid.radioDecodings) &&
     (tiraid.radioDecodings.length > 0)) {
    return tiraid.radioDecodings[0].rssi;
  }
  return null;

}


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
 * Return a flattened representation of the tiraid.
 * @param {Object} tiraid The given tiraid.
 * @return {Object} The flattened representation of the tiraid.
 */
function toFlattened(tiraid) {
  var flattened = {};

  flattened.time = getTimestamp(tiraid);
  flattened.deviceId = getDeviceId(tiraid);
  flattened.receiverId = getReceiverId(tiraid);
  flattened.rssi = getRSSI(tiraid);

  return flattened;
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

  var output = 'dID: ';
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
module.exports.getTimestamp = getTimestamp;
module.exports.getDeviceId = getDeviceId;
module.exports.getReceiverId = getReceiverId;
module.exports.getAssociationIds = getAssociationIds;
module.exports.getRSSI = getRSSI;
module.exports.isValid = isValid;
module.exports.isReelyActiveTransmission = isReelyActiveTransmission;
module.exports.toFlattened = toFlattened;
module.exports.toShortString = toShortString;
module.exports.toCSVString = toCSVString;
