/**
 * Copyright reelyActive 2016
 * We believe in an open Internet of Things
 */


var time = require('./time');
var tiraid = require('./tiraid');
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
var DEFAULT_TIMEOUT_MILLISECONDS = 30000;


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
  var parameters = { uri: uri, timeout: options.timeout, json: event };

  // Is the event valid?
  if(!isValid(event)) {
    if(options.logToConsole) {
      console.log('Invalid event');
    }
    return callback('Invalid event', event);
  }

  // Make the POST request
  request.post(parameters, function(err, res, body) {

    // POST error
    if(err) {
      if(options.logToConsole) {
        console.log(err.message);
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
        console.log(event + ' POST successful');
      }
      return callback(null, event, message);
    }
  });
}


module.exports.APPEARANCE = TYPE_APPEARANCE;
module.exports.DISPLACEMENT = TYPE_DISPLACEMENT;
module.exports.KEEPALIVE = TYPE_KEEPALIVE;
module.exports.DISAPPEARANCE = TYPE_DISAPPEARANCE;
module.exports.EVENTS_ROUTE_NAME = EVENTS_ROUTE_NAME;
module.exports.isValid = isValid;
module.exports.postUpdate = postUpdate;
