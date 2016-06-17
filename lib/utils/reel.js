/**
 * Copyright reelyActive 2016
 * We believe in an open Internet of Things
 */


var identifier = require('./identifier');
var request = require('request');


// Constants (Type)
var TYPE_REELCEIVER_STATISTICS = 'reelceiverStatistics';

// Constants
var DEFAULT_HOSTNAME = 'www.hyperlocalcontext.com';
var DEFAULT_PORT = '80';
var DEFAULT_TIMEOUT_MILLISECONDS = 10000;
var DEFAULT_HEADERS = { 'Content-Type': 'application/json' };


/**
 * Perform an HTTP PUT to the appropriate route for the given status update.
 * @param {Object} options The given options.
 * @param {Object} event The given event/update.
 * @param {function} callback Function to call on completion.
 */
function putStatusUpdate(options, event, callback) {
  options = options || {};
  options.hostname = options.hostname || DEFAULT_HOSTNAME;
  options.port = options.port || DEFAULT_PORT;
  options.timeout = options.timeout || DEFAULT_TIMEOUT_MILLISECONDS;
  options.logToConsole = options.logToConsole || false;

  var route = getStatusRoute(event);

  if(!route) {
    return callback('Invalid reel event', event);
  }

  var uri = 'http://' + options.hostname + ':' + options.port + route;
  var parameters = { uri: uri, timeout: options.timeout, json: event,
                     headers: DEFAULT_HEADERS };

  if(options.hasOwnProperty('proxy')) {
    parameters.proxy = options.proxy;
  }

  // Make the PUT request
  request.put(parameters, function(err, res, body) {

    // PUT error
    if(err) {
      if(options.logToConsole) {
        console.log('FAIL ' + route + '\r\n' + '     ' + err.message);
      }
      return callback(err.message, event);
    }

    // PUT okay
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
        console.log('OKAY ' + route);
      }
      return callback(null, event, message);
    }
  });
}


/**
 * Determine the API route for the given status event.
 * @param {Object} event The given event/update.
 */
function getStatusRoute(event) {

  if((!event) || !(event.hasOwnProperty('type'))) {
    return null;
  }

  switch(event.type) {
    case TYPE_REELCEIVER_STATISTICS:
      var id = event.receiverId;
      if(identifier.isValid(id)) {
        return '/reel/statistics/' + id;
      }
      return null;
    default:
      return null;
  }
}


module.exports.REELCEIVER_STATISTICS = TYPE_REELCEIVER_STATISTICS;
module.exports.putStatusUpdate = putStatusUpdate;
