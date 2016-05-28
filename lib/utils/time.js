/**
 * Copyright reelyActive 2015
 * We believe in an open Internet of Things
 */


/**
 * Return the given timestamp as a number of milliseconds since 1970
 * @param {Object} timestamp The timestamp as milliseconds or ISO String.
 * @return {Number} Given timestamp as a number of milliseconds.
 */
function toTimestamp(timestamp) {
  if(typeof timestamp !== 'number') {
    timestamp = new Date(timestamp).getTime();
  }
  return timestamp;
};


/**
 * Return the current timestamp as a number of milliseconds since 1970
 * @return {Number} Current timestamp as a number of milliseconds.
 */
function getCurrent() {
  return new Date().getTime();
};


/**
 * Return the current timestamp in ISO8601 format
 * @return {String} Current timestamp in ISO8601 format.
 */
function getCurrentISO() {
  return new Date().toISOString();
};


/**
 * Return the timestamp the given number of milliseconds in the future
 * @return {Number} Future timestamp as a number of milliseconds.
 */
function getFuture(milliseconds) {
  return getCurrent() + milliseconds;
};


/**
 * Return the offset in milliseconds from the current time
 * @param {Object} timestamp The timestamp as milliseconds or String.
 * @return {Number} Number of milliseconds in the future (negative if past).
 */
function getCurrentOffset(timestamp) {
  var numericalTimestamp = toTimestamp(timestamp);
  return numericalTimestamp - getCurrent();
};


/**
 * Return the given timestamp advanced by the given number of milliseconds
 * @param {Object} timestamp The timestamp as milliseconds or String.
 * @param {Number} milliseconds The number of milliseconds to advance.
 * @return {Number} Future timestamp as a number of milliseconds.
 */
function toFuture(timestamp, milliseconds) {
  var numericalTimestamp = toTimestamp(timestamp);
  return numericalTimestamp + milliseconds;
};


/**
 * Return whether the given timestamp is in the past
 * @param {Object} timestamp The timestamp as milliseconds or String.
 * @return {boolean} Is current timestamp in the past?
 */
function isInPast(timestamp) {
  var numericalTimestamp = toTimestamp(timestamp);
  return (getCurrent() > numericalTimestamp);
}


/**
 * Return whether the first given timestamp is earlier than the second
 * @param {Object} timestamp1 The first timestamp as milliseconds or String.
 * @param {Object} timestamp2 The second timestamp as milliseconds or String.
 * @return {boolean} Is the first timestamp earlier?
 */
function isEarlier(timestamp1, timestamp2) {
  var numericalTimestamp1 = toTimestamp(timestamp1);
  var numericalTimestamp2 = toTimestamp(timestamp2);
  return (numericalTimestamp1 < numericalTimestamp2);
}


/**
 * Return whether the given timestamp is valid
 * @param {Object} timestamp The given timestamp.
 * @return {boolean} True if the given timestamp is valid, false otherwise.
 */
function isValid(timestamp) {

  if(!timestamp) {
    return false;
  }

  if(typeof timestamp === 'number') {
    return true; // TODO: validate number itself
  }
  else if(typeof timestamp === 'string') {
    return true; // TODO: validate ISO string
  }

  return false;
}


/**
 * Return the given timestamp as the local time of day
 * @param {Object} timestamp The timestamp as milliseconds or ISO String.
 * @return {String} Given timestamp as human-readable time of day.
 */
function toLocalTimeOfDay(timestamp) {
  var date = new Date(timestamp);
  var output = '';
  output += ('0' + date.getHours()).slice(-2);
  output += ':';
  output += ('0' + date.getMinutes()).slice(-2);
  output += ':';
  output += ('0' + date.getSeconds()).slice(-2);
  output += '.';
  output += ('00' + date.getMilliseconds()).slice(-3);
  return output;
};


/**
 * Return the given timestamp as a twelve-digit string, local time
 * @param {Object} timestamp The timestamp as milliseconds or ISO String.
 * @return {String} Given timestamp as a twelve-digit string.
 */
function toLocalTwelveDigitString(timestamp) {
  var date = new Date(timestamp);
  var output = '';
  output += date.getFullYear().toString().slice(-2);
  output += ('0' + (date.getMonth() + 1)).slice(-2);
  output += ('0' + date.getDate()).slice(-2);
  output += ('0' + date.getHours()).slice(-2);
  output += ('0' + date.getMinutes()).slice(-2);
  output += ('0' + date.getSeconds()).slice(-2);
  return output;
};


module.exports.toTimestamp = toTimestamp;
module.exports.getCurrent = getCurrent;
module.exports.getCurrentISO = getCurrentISO;
module.exports.getFuture = getFuture;
module.exports.getCurrentOffset = getCurrentOffset;
module.exports.toFuture = toFuture;
module.exports.isInPast = isInPast;
module.exports.isEarlier = isEarlier;
module.exports.isValid = isValid;
module.exports.toLocalTimeOfDay = toLocalTimeOfDay;
module.exports.toLocalTwelveDigitString = toLocalTwelveDigitString;
