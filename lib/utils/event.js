/**
 * Copyright reelyActive 2016
 * We believe in an open Internet of Things
 */


var time = require('./time');
var tiraid = require('./tiraid');
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


module.exports.APPEARANCE = TYPE_APPEARANCE;
module.exports.DISPLACEMENT = TYPE_DISPLACEMENT;
module.exports.KEEPALIVE = TYPE_KEEPALIVE;
module.exports.DISAPPEARANCE = TYPE_DISAPPEARANCE;
module.exports.EVENTS_ROUTE_NAME = EVENTS_ROUTE_NAME;
module.exports.CSV_HEADER = CSV_HEADER;
module.exports.getEvent = getEvent;
module.exports.isValid = isValid;
module.exports.postUpdate = postUpdate;
module.exports.toFlattened = toFlattened;
module.exports.toCSVString = toCSVString;
module.exports.eventqueue = eventqueue;
