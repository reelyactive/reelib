/**
 * Copyright reelyActive 2016-2017
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
var INPUT_DATA_ACCEPT_CRITERIA_1 = null;
var INPUT_DATA_ACCEPT_CRITERIA_2 = { deviceIds: [ '001bc50940100000' ] };
var INPUT_DATA_ACCEPT_CRITERIA_3 = {
  deviceIds: [ '001bc50940100000' ],
  rssi: { minimum: 100, maximum: 200 }
};
var INPUT_DATA_ACCEPT_CRITERIA_4 = {
  receiverIds: [ '001bc50940800000' ],
  rssi: { minimum: 150 }
};
var INPUT_DATA_REJECT_CRITERIA_1 = null;
var INPUT_DATA_REJECT_CRITERIA_2 = { receiverIds: [ '001bc50940800000' ] };


// Expected outputs for the scenario
var EXPECTED_DATA_EVENT = "appearance";
var EXPECTED_DATA_VALID = true;
var EXPECTED_DATA_NULL = false;
var EXPECTED_DATA_EMPTY = false;
var EXPECTED_DATA_FLATTENED = { event: "appearance",
                                time: 1388539425678,
                                deviceId: "001bc50940100000",
                                deviceAssociationIds: [ '001bc5094' ],
                                receiverId: "001bc50940800000",
                                rssi: 128 };
var EXPECTED_DATA_CSV_STRING = '20:23:45.678,001bc50940100000,001bc50940800000,128,appearance';
var EXPECTED_DATA_PASS_1_1 = true;
var EXPECTED_DATA_PASS_1_2 = false;
var EXPECTED_DATA_PASS_2_1 = true;
var EXPECTED_DATA_PASS_2_2 = false;
var EXPECTED_DATA_PASS_3_1 = true;
var EXPECTED_DATA_PASS_3_2 = false;
var EXPECTED_DATA_PASS_4_1 = false;
var EXPECTED_DATA_PASS_4_2 = false;


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

  // Test the isPass function for scenario 1-1
  it('should pass filter scenario 1-1', function() {
    assert.strictEqual(event.isPass(INPUT_DATA_VALID,
                                    INPUT_DATA_ACCEPT_CRITERIA_1,
                                    INPUT_DATA_REJECT_CRITERIA_1),
                       EXPECTED_DATA_PASS_1_1);
  });

  // Test the isPass function for scenario 1-2
  it('should not pass filter scenario 1-2', function() {
    assert.strictEqual(event.isPass(INPUT_DATA_VALID,
                                    INPUT_DATA_ACCEPT_CRITERIA_1,
                                    INPUT_DATA_REJECT_CRITERIA_2),
                       EXPECTED_DATA_PASS_1_2);
  });

  // Test the isPass function for scenario 2-1
  it('should pass filter scenario 2-1', function() {
    assert.strictEqual(event.isPass(INPUT_DATA_VALID,
                                    INPUT_DATA_ACCEPT_CRITERIA_2,
                                    INPUT_DATA_REJECT_CRITERIA_1),
                       EXPECTED_DATA_PASS_2_1);
  });

  // Test the isPass function for scenario 2-2
  it('should not pass filter scenario 2-2', function() {
    assert.strictEqual(event.isPass(INPUT_DATA_VALID,
                                    INPUT_DATA_ACCEPT_CRITERIA_2,
                                    INPUT_DATA_REJECT_CRITERIA_2),
                       EXPECTED_DATA_PASS_2_2);
  });

  // Test the isPass function for scenario 3-1
  it('should pass filter scenario 3-1', function() {
    assert.strictEqual(event.isPass(INPUT_DATA_VALID,
                                    INPUT_DATA_ACCEPT_CRITERIA_3,
                                    INPUT_DATA_REJECT_CRITERIA_1),
                       EXPECTED_DATA_PASS_3_1);
  });

  // Test the isPass function for scenario 3-2
  it('should not pass filter scenario 3-2', function() {
    assert.strictEqual(event.isPass(INPUT_DATA_VALID,
                                    INPUT_DATA_ACCEPT_CRITERIA_3,
                                    INPUT_DATA_REJECT_CRITERIA_2),
                       EXPECTED_DATA_PASS_3_2);
  });

  // Test the isPass function for scenario 4-1
  it('should pass filter scenario 4-1', function() {
    assert.strictEqual(event.isPass(INPUT_DATA_VALID,
                                    INPUT_DATA_ACCEPT_CRITERIA_4,
                                    INPUT_DATA_REJECT_CRITERIA_1),
                       EXPECTED_DATA_PASS_4_1);
  });

  // Test the isPass function for scenario 4-2
  it('should not pass filter scenario 4-2', function() {
    assert.strictEqual(event.isPass(INPUT_DATA_VALID,
                                    INPUT_DATA_ACCEPT_CRITERIA_4,
                                    INPUT_DATA_REJECT_CRITERIA_2),
                       EXPECTED_DATA_PASS_4_2);
  });

});
