/**
 * Copyright reelyActive 2016
 * We believe in an open Internet of Things
 */

var event = require("../../../lib/utils/event.js");
var assert = require('assert'); 


// Inputs for the scenario
var VALID_TIRAID = {
  "identifier": {
    "type": "EUI-64",
    "value": "001bc50940100000"
  },
  "timestamp": "2014-01-01T01:23:45.678Z",
  "radioDecodings": [
    {
      "rssi": 128,
      "identifier": {
        "type": "EUI-64",
        "value": "001bc50940800000"
      }
    }
  ]
};
var INPUT_DATA_VALID = {
  "event": "appearance",
  "tiraid": VALID_TIRAID
};
var INPUT_DATA_NULL = null;
var INPUT_DATA_EMPTY = {};


// Expected outputs for the scenario
var EXPECTED_DATA_EVENT = "appearance";
var EXPECTED_DATA_VALID = true;
var EXPECTED_DATA_NULL = false;
var EXPECTED_DATA_EMPTY = false;
var EXPECTED_DATA_FLATTENED = { event: "appearance",
                                time: 1388539425678,
                                deviceId: "001bc50940100000",
                                receiverId: "001bc50940800000",
                                rssi: 128 };
var EXPECTED_DATA_CSV_STRING = '20:23:45.678,001bc50940100000,001bc50940800000,128,appearance';


// Describe the scenario
describe('event', function() {

  // Test the getEvent function with a valid event
  it('should return the type of the event', function() {
    assert.strictEqual(event.getEvent(INPUT_DATA_VALID), EXPECTED_DATA_EVENT);
  });

  // Test the isValid function with a valid event
  it('should assert that a valid event is valid', function() {
    assert.strictEqual(event.isValid(INPUT_DATA_VALID), EXPECTED_DATA_VALID);
  });

  // Test the isValid function with a null event
  it('should assert that a null event is invalid', function() {
    assert.strictEqual(event.isValid(INPUT_DATA_NULL), EXPECTED_DATA_NULL);
  });

  // Test the isValid function with an empty event
  it('should assert that an empty event is invalid', function() {
    assert.strictEqual(event.isValid(INPUT_DATA_EMPTY), EXPECTED_DATA_EMPTY);
  });

  // Test the toFlattened function with a valid event
  it('should convert the event to a flattened object', function() {
    assert.deepEqual(event.toFlattened(INPUT_DATA_VALID),
                     EXPECTED_DATA_FLATTENED);
  });

  // Test the toCSVString function with a valid event
  it('should convert the tiraid to a CSV string (EST!)', function() {
    assert.strictEqual(event.toCSVString(INPUT_DATA_VALID),
                       EXPECTED_DATA_CSV_STRING);
  });

});
