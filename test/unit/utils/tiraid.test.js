/**
 * Copyright reelyActive 2015
 * We believe in an open Internet of Things
 */

var tiraid = require("../../../lib/utils/tiraid.js");
var assert = require ('assert'); 


// Inputs for the scenario
var INPUT_DATA_VALID = {
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
var INPUT_DATA_NULL = null;
var INPUT_DATA_EMPTY = {};


// Expected outputs for the scenario
var EXPECTED_DATA_VALID = true;
var EXPECTED_DATA_NULL = false;
var EXPECTED_DATA_EMPTY = false;
var EXPECTED_DATA_SHORT_STRING = 'tID: 001bc50940100000 rID: 001bc50940800000 rssi: 128 at 20:23:45.678';


// Describe the scenario
describe('tiraid', function() {

  // Test the isValid function with a valid tiraid
  it('should assert that a valid tiraid is valid', function() {
    assert.strictEqual(tiraid.isValid(INPUT_DATA_VALID), EXPECTED_DATA_VALID);
  });

  // Test the isValid function with a null tiraid
  it('should assert that a null tiraid is invalid', function() {
    assert.strictEqual(tiraid.isValid(INPUT_DATA_NULL), EXPECTED_DATA_NULL);
  });

  // Test the isValid function with an empty tiraid
  it('should assert that an empty tiraid is invalid', function() {
    assert.strictEqual(tiraid.isValid(INPUT_DATA_EMPTY), EXPECTED_DATA_EMPTY);
  });

  // Test the toShortString function with a valid tiraid
  it('should convert the tiraid to a short string (EST!)', function() {
    assert.strictEqual(tiraid.toShortString(INPUT_DATA_VALID),
                       EXPECTED_DATA_SHORT_STRING);
  });

});
