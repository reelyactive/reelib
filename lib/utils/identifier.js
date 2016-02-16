/**
 * Copyright reelyActive 2014-2015
 * We believe in an open Internet of Things
 */


// Constants (Type)
var TYPE_EUI64 = 'EUI-64';
var TYPE_RA28 = 'RA-28';
var TYPE_ADVA48 = 'ADVA-48';
var TYPE_RADIO_PAYLOAD = 'RadioPayload';
var TYPE_UNDEFINED = 'Undefined';

// Constants
var REELYACTIVE_OUI36 = '001bc5094';
var REELYACTIVE_UUID128 = '7265656c794163746976652055554944';
var BITS_PER_NIBBLE = 4;
var UUID16_BITS = 16;
var ADVA48_BITS = 48;
var EUI64_BITS = 64;
var UUID128_BITS = 128;


/**
 * Return the given type and value as an identifier.
 * @param {string} type Type of identifier.
 * @param {Object} value The value of the given identifier.
 * @return {Object} Given identifier.
 */
function toIdentifier(type, value) {
  var identifier = {};
  var isValue = (value != null);

  // EUI-64
  if((type === TYPE_EUI64) && isValue) {
    identifier.type = TYPE_EUI64;
    identifier.value = value;
  }

  // RA-28
  else if((type === TYPE_RA28) && isValue) {
    identifier.type = TYPE_RA28;
    identifier.value = value.substr(value.length - 7, 7);
  }

  // ADVA-48
  else if((type === TYPE_ADVA48) && isValue) {
    identifier.type = TYPE_ADVA48;
    identifier.value = value;
  }

  // RadioPayload
  else if((type === TYPE_RADIO_PAYLOAD) && isValue) {
    identifier.type = TYPE_RADIO_PAYLOAD;
    identifier.value = value.payload;
    identifier.lengthBytes = value.payloadLengthBytes;
  }

  // Undefined
  else {
    identifier.type = TYPE_UNDEFINED;
    identifier.value = null;
  }

  return identifier;
}


/**
 * Convert the given identifier to a valid identifier string, if possible.
 * @param {Object} identifier The given identifier.
 * @return {String} Valid identifier string, or null if invalid input.
 */
function toIdentifierString(identifier) {

  // Exists?
  if(!identifier) {
    return null;
  }

  // Identifier string as input
  if(typeof identifier === 'string') {
    var hexIdentifier = identifier.replace(/[^A-Fa-f0-9]/g, '');
    var lengthInBits = hexIdentifier.length * BITS_PER_NIBBLE;

    if((lengthInBits === ADVA48_BITS) || (lengthInBits === EUI64_BITS) ||
       (lengthInBits === UUID16_BITS) || (lengthInBits === UUID128_BITS)) {
      return hexIdentifier.toLowerCase();
    }
    return null;
  }

  // Valid identifier object as input
  else if(identifier.hasOwnProperty('value')) {
    return toIdentifierString(identifier.value);
  }

  // Invalid identifier as input
  else {
    return null;
  }
}


/**
 * Convert the given identifier to a new one of the given type, if possible.
 * @param {Object} identifier The given identifier 
 * @param {string} newType New identifier type.
 * @return {Object} A new identifier of the given type, or type undefined.
 */
function convertType(identifier, newType) {
  var isEUI64Target = (newType === TYPE_EUI64);
  var isRA28Source = (identifier.type === TYPE_RA28);

  // Currently only supports conversion from RA28 to EUI64
  if(isEUI64Target && isRA28Source) {
    return toIdentifier(TYPE_EUI64, REELYACTIVE_OUI36 + identifier.value);
  }

  // Undefined
  else {
    return toIdentifier(TYPE_UNDEFINED);
  }
}


/**
 * Return whether the given identifier is valid or not.
 * @param {Object} identifier The given identifier.
 * @return {boolean} True if the given identifier is valid, false otherwise.
 */
function isValid(identifier) {

  // Exists?
  if(!identifier) {
    return false;
  }

  // Identifier string as input
  if(typeof identifier === 'string') {
    return (identifier === toIdentifierString(identifier));
  }

  // Has valid value and type?
  if(!(identifier.hasOwnProperty('value') &&
       identifier.hasOwnProperty('type') &&
       (typeof identifier.value === 'string') &&
       (typeof identifier.type === 'string') &&
       isValid(identifier.value))) {
    return false;
  }

  return true;
}


module.exports.EUI64 = TYPE_EUI64;
module.exports.RA28 = TYPE_RA28;
module.exports.ADVA48 = TYPE_ADVA48;
module.exports.RADIO_PAYLOAD = TYPE_RADIO_PAYLOAD;
module.exports.UNDEFINED = TYPE_UNDEFINED;
module.exports.REELYACTIVE_UUID128 = REELYACTIVE_UUID128;
module.exports.toIdentifier = toIdentifier;
module.exports.toIdentifierString = toIdentifierString;
module.exports.convertType = convertType;
module.exports.isValid = isValid;
