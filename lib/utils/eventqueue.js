/**
 * Copyright reelyActive 2016
 * We believe in an open Internet of Things
 */

var event = require('./event');
var time = require('./time');
var tiraid = require('./tiraid');


var DEFAULT_KEEP_ALIVE_MILLISECONDS = 5000;
var DEFAULT_DISAPPEARANCE_MILLISECONDS = 15000;


/**
 * EventQueue Class
 * Simple queue that converts tiraids to timely events.
 * @param {Object} options The options as a JSON object.
 * @constructor
 */
function EventQueue(options) {
  options = options || {};
  var self = this;

  self.keepAliveMilliseconds = options.keepAliveMilliseconds ||
                               DEFAULT_KEEP_ALIVE_MILLISECONDS;
  self.disappearanceMilliseconds = options.disappearanceMilliseconds ||
                                   DEFAULT_DISAPPEARANCE_MILLISECONDS;

  self.devices = {};

  function cleanup() {
    handleDisappearances(self);
  }
  setInterval(cleanup, self.disappearanceMilliseconds);
}


/**
 * Insert a tiraid into the queue, prompting an event in the callback if due.
 * @param {Object} givenTiraid The given tiraid.
 * @param {callback} callback Function to call on completion.
 */
EventQueue.prototype.insert = function(givenTiraid, callback) {
  var self = this;

  var givenEvent = tiraid.toFlattened(givenTiraid);

  // New device: insert and callback event
  if(!self.devices.hasOwnProperty(givenEvent.deviceId)) {
    givenEvent.event = event.APPEARANCE;
    self.devices[givenEvent.deviceId] = {
      nextKeepAliveTime: time.toFuture(givenEvent.time,
                                       self.keepAliveMilliseconds),
      event: givenEvent
    };
    return callback(givenEvent);
  }

  // Existing device: merge
  else {
    var device = self.devices[givenEvent.deviceId];
    givenEvent.event = event.KEEPALIVE;
    device.event = mergeEvents(givenEvent, device.event); 

    // Keep-alive threshold exceeded: callback event
    if(time.isEarlier(device.nextKeepAliveTime, device.event.time)) {
      device.nextKeepAliveTime = time.toFuture(device.event.time,             
                                               self.keepAliveMilliseconds);
      return callback(device.event);
    }
    else {
      return callback(null);
    }
  }
};


/**
 * Handle disappearances by removing them from the queue to free memory.
 * @param {EventQueue} instance The EventQueue instance.
 */
function handleDisappearances(instance) {
  var cutoffTime = time.getFuture(-instance.disappearanceMilliseconds);

  for(device in instance.devices) {
    if(time.isEarlier(instance.devices[device].nextKeepAliveTime,
                      cutoffTime)) {
      delete instance.devices[device];
    }
  }
}


/**
 * Merge two events, specifically the deviceAssociationIds.
 * @param {Object} currentEvent The current event to merge into.
 * @param {Object} previousEvent The previous event to merge from.
 */
function mergeEvents(currentEvent, previousEvent) {
  if(previousEvent.hasOwnProperty('deviceAssociationIds') &&
     previousEvent.deviceAssociationIds.length) {
    for(var cId = 0; cId < previousEvent.deviceAssociationIds.length; cId++) {
      var id = previousEvent.deviceAssociationIds[cId];
      if(currentEvent.deviceAssociationIds.indexOf(id) < 0) {
        if((id.length === 32) || (id.length === 40)) {   // 128-bit UUID and
          currentEvent.deviceAssociationIds.unshift(id); //   iBeacon have
        }                                                //   higher priority
        else {                                           // Other ids have
          currentEvent.deviceAssociationIds.push(id);    //   lower priority
        }
      }
    }
  }
  return currentEvent;
}

module.exports = EventQueue;
