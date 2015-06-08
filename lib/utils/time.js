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


module.exports.toTimestamp = toTimestamp;
module.exports.getCurrent = getCurrent;
module.exports.getCurrentISO = getCurrentISO;
module.exports.getFuture = getFuture;
module.exports.getCurrentOffset = getCurrentOffset;
module.exports.toFuture = toFuture;
module.exports.isInPast = isInPast;
module.exports.isEarlier = isEarlier;