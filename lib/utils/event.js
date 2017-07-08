/**
 * Copyright reelyActive 2016-2017
 * We believe in an open Internet of Things
 */


var time = require('./time');
var tiraid = require('./tiraid');
var identifier = require('./identifier');
var eventqueue = require('./eventqueue');
var request = require('request');


// Constants (Type)
var TYPE_APPEARANCE = 'appearance';
var TYPE_DISPLACEMENT = 'displacement';
var TYPE_KEEPALIVE = 'keep-alive';
var TYPE_DISAPPEARANCE = 'disappearance';

// Constants
var EVENTS_ROUTE_NAME = 'events';
var DEFAULT_HOSTNAME = 'www.hyperlocalcontext.com';
var DEFAULT_PORT = '80';
var DEFAULT_TIMEOUT_MILLISECONDS = 10000;
var DEFAULT_HEADERS = { 'Content-Type': 'application/json' };
var CSV_HEADER = tiraid.CSV_HEADER + ',Event';
var IBEACON_ID_LENGTH = 40;


/**
 * Return the type of event.
 * @param {Object} event The given event.
 * @return {String} The type of event.
 */
function getEvent(event) {

  if(event && event.hasOwnProperty('event')) {
    return event.event;
  }
  return null;

}


/**
 * Return whether the given event is valid or not.
 * @param {Object} event The given event.
 * @return {boolean} True if the given event is valid, false otherwise.
 */
function isValid(event) {

  if(!event) {
    return false;
  }

  // Event type exists and is a string?
  if(!(event.hasOwnProperty('event') &&
       (typeof event.event === 'string'))) {
    return false;
  }

  // Event type is valid?
  if(!((event.event === TYPE_APPEARANCE) ||
       (event.event === TYPE_DISPLACEMENT) ||
       (event.event === TYPE_KEEPALIVE) ||
       (event.event === TYPE_DISAPPEARANCE))) {
    return false;
  }

  // tiraid is valid?
  if(!tiraid.isValid(event.tiraid)) {
    return false;
  }

  return true;
}


/**
 * Return whether the given event passes the given filters or not, with a null
 *   criteria defaulting to pass.
 * @param {Object} event The given event.
 * @param {Object} accept The acceptance criteria.
 * @param {Object} reject The rejection criteria.
 * @return {boolean} True if the given event is a pass, false otherwise.
 */
function isPass(event, accept, reject) {

  if((reject && isFiltered(event, reject)) ||
     (accept && !isFiltered(event, accept))) {
    return false;
  }
  return true;
}


/**
 * Perform an HTTP POST of the given event.
 * @param {Object} options The given options.
 * @param {Object} event The given event.
 * @param {function} callback Function to call on completion.
 */
function postUpdate(options, event, callback) {
  options = options || {};
  options.hostname = options.hostname || DEFAULT_HOSTNAME;
  options.port = options.port || DEFAULT_PORT;
  options.timeout = options.timeout || DEFAULT_TIMEOUT_MILLISECONDS;
  options.logToConsole = options.logToConsole || false;

  var uri = 'http://' + options.hostname + ':' + options.port + '/' +
            EVENTS_ROUTE_NAME;
  var parameters = { uri: uri, timeout: options.timeout, json: event,
                     headers: DEFAULT_HEADERS };

  if(options.hasOwnProperty('proxy')) {
    parameters.proxy = options.proxy;
  }

  // Is the event valid?
  if(!isValid(event)) {
    if(options.logToConsole) {
      console.log('FAIL Invalid event');
    }
    return callback('Invalid event', event);
  }

  // Make the POST request
  request.post(parameters, function(err, res, body) {

    // POST error
    if(err) {
      if(options.logToConsole) {
        console.log('FAIL ' + tiraid.toShortString(event.tiraid) + '\r\n' +
                    '     ' + err.message);
      }
      return callback(err.message, event);
    }

    // POST okay
    else {
      var message = '';
      if(res && body && (typeof body === 'string')) {
        try {
          body = JSON.parse(body);
          message = body.message;
        }
        catch(e) {
          message = body;
        }
      }
      if(options.logToConsole) {
        console.log('OKAY ' + tiraid.toShortString(event.tiraid));
      }
      return callback(null, event, message);
    }
  });
}


/**
 * Return a flattened representation of the event.
 * @param {Object} event The given event.
 * @return {Object} The flattened representation of the event.
 */
function toFlattened(event) {
  var givenEvent = event || {};

  var flattened = tiraid.toFlattened(givenEvent.tiraid);
  flattened.event = getEvent(givenEvent);

  return flattened;
}


/**
 * Return a CSV string representation of the event.
 * @param {Object} event The given event.
 * @return {String} The event as a CSV string.
 */
function toCSVString(event) {
  
  if(!isValid(event)) {
    return null;
  }

  var output = tiraid.toCSVString(event.tiraid) + ',';
  output += event.event;
  return output;
}


/**
 * Return whether the given event meets the given filter criteria or not:
 *   - a null criteria returns true (ambiguous!)
 *   - a {} criteria returns false (none of the subcriteria can be met!)
 *   - if there are multiple criteria, all must be met to return true
 * @param {Object} event The given event.
 * @param {Object} filter The filter criteria.
 * @return {boolean} True if the given event is filtered, false otherwise.
 */
function isFiltered(event, criteria) {
  if(!criteria) {
    return true;
  }

  var flattenedEvent = toFlattened(event); // TODO: review when all events flat
  var criteriaMet = false;

  if(criteria.hasOwnProperty('deviceIds')) {
    if(identifier.isMatch(flattenedEvent.deviceId, criteria.deviceIds) ||
       identifier.isMatch(flattenedEvent.deviceAssociationIds,
                          criteria.deviceIds)) {
      criteriaMet = true;
    }
    if(!criteriaMet) {
      return false;
    }
  }

  if(criteria.hasOwnProperty('receiverIds')) {
    if(!identifier.isMatch(flattenedEvent.receiverId, criteria.receiverIds)) { 
      return false;
    }
    criteriaMet = true;
  }

  if(criteria.hasOwnProperty('rssi')) {
    if(criteria.rssi.hasOwnProperty('minimum') &&
       (flattenedEvent.rssi < criteria.rssi.minimum)) {
      return false;
    }
    if(criteria.rssi.hasOwnProperty('maximum') &&
       (flattenedEvent.rssi > criteria.rssi.maximum)) {
      return false;
    }
    criteriaMet = true;
  }

  return criteriaMet;
}


module.exports.APPEARANCE = TYPE_APPEARANCE;
module.exports.DISPLACEMENT = TYPE_DISPLACEMENT;
module.exports.KEEPALIVE = TYPE_KEEPALIVE;
module.exports.DISAPPEARANCE = TYPE_DISAPPEARANCE;
module.exports.EVENTS_ROUTE_NAME = EVENTS_ROUTE_NAME;
module.exports.CSV_HEADER = CSV_HEADER;
module.exports.getEvent = getEvent;
module.exports.isValid = isValid;
module.exports.isPass = isPass;
module.exports.postUpdate = postUpdate;
module.exports.toFlattened = toFlattened;
module.exports.toCSVString = toCSVString;
module.exports.eventqueue = eventqueue;
