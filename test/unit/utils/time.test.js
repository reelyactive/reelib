/**
 * Copyright reelyActive 2015
 * We believe in an open Internet of Things
 */

var time = require("../../../lib/utils/time.js");
var assert = require ('assert'); 


// Inputs for the scenario
var INPUT_DATA_NUMERICAL_TIMESTAMP = 1420075425678;
var INPUT_DATA_STRING_TIMESTAMP = '2015-01-01T01:23:45.678Z';
var INPUT_DATA_DELTA_MS = 1000;
var INPUT_DATA_NUMERICAL_TIMESTAMP_DELTA = INPUT_DATA_NUMERICAL_TIMESTAMP +
                                           INPUT_DATA_DELTA_MS;
var INPUT_DATA_NUMERICAL_TIMESTAMP_SINGULARITY = 2366841600000;
var INPUT_DATA_STRING_TIMESTAMP_SINGULARITY = '2045-01-01T00:00:00.000Z';

// Expected outputs for the scenario
var EXPECTED_DATA_NUMERICAL_TIMESTAMP = INPUT_DATA_NUMERICAL_TIMESTAMP;
var EXPECTED_DATA_STRING_TIMESTAMP = 1420075425678;
var EXPECTED_DATA_TYPE_NUMERICAL = 'number';
var EXPECTED_DATA_TYPE_STRING = 'string';
var EXPECTED_DATA_DELTA_MS = INPUT_DATA_DELTA_MS;


// Describe the scenario
describe('time', function() {

  // Set up the scenario (run once at the start)
  before(function() {
    var self = this;
    self.initialTimestamp = time.getCurrent();
    self.advancedTimestamp = time.toFuture(self.initialTimestamp,
                                           INPUT_DATA_DELTA_MS);
  });

  // Test the toTimestamp function with numerical timestamp
  it('should not convert an already numerical timestamp', function() {
    assert.strictEqual(time.toTimestamp(INPUT_DATA_NUMERICAL_TIMESTAMP),
                       EXPECTED_DATA_NUMERICAL_TIMESTAMP);
  });

  // Test the toTimestamp function with string timestamp
  it('should convert a string timestamp to numerical', function() {
    assert.strictEqual(time.toTimestamp(INPUT_DATA_STRING_TIMESTAMP),
                       EXPECTED_DATA_STRING_TIMESTAMP);
  });

  // Test the getCurrent function
  it('should return the current time as a number', function() {
    var timestamp = time.getCurrent();
    var isNumerical = (typeof timestamp === EXPECTED_DATA_TYPE_NUMERICAL);
    assert.ok(isNumerical);
  });

  // Test the getCurrentISO function
  it('should return the current time as a string', function() {
    var timestamp = time.getCurrentISO();
    var isString = (typeof timestamp === EXPECTED_DATA_TYPE_STRING);
    assert.ok(isString);
  });

  // Test the getFuture function
  it('should return the future time as a number in the future', function() {
    var futureTimestamp = time.getFuture(INPUT_DATA_DELTA_MS);
    var isNumerical = (typeof futureTimestamp ===
                       EXPECTED_DATA_TYPE_NUMERICAL);
    var isInFuture = (futureTimestamp > INPUT_DATA_NUMERICAL_TIMESTAMP);
    assert.ok(isNumerical && isInFuture);
  });

  // Test the getCurrentOffset function
  it('should return a negative offset for past timestamps', function() {
    var offset = time.getCurrentOffset(INPUT_DATA_NUMERICAL_TIMESTAMP);
    var isNegative = (offset < 0);
    assert.ok(isNegative);
  });

  // Test the getCurrentOffset function
  it('should return a positive offset for future timestamps', function() {
    var offset = time.getCurrentOffset(
                     INPUT_DATA_NUMERICAL_TIMESTAMP_SINGULARITY);
    var isPositive = (offset > 0);
    assert.ok(isPositive);
  });

  // Test the toFuture function
  it('should return a timestamp the given ms in the future', function() {
    var futureTimestamp = time.toFuture(INPUT_DATA_NUMERICAL_TIMESTAMP,
                                        INPUT_DATA_DELTA_MS);
    var delta = futureTimestamp - INPUT_DATA_NUMERICAL_TIMESTAMP;
    assert.strictEqual(delta, EXPECTED_DATA_DELTA_MS);
  });

  // Test the isInPast function
  it('should recognise a timestamp in the past', function() {
    assert.ok(time.isInPast(INPUT_DATA_NUMERICAL_TIMESTAMP));
  });

  // Test the isEarlier function with numerical values
  it('should recognise an earlier timestamp (both numerical)', function() {
    assert.ok(time.isEarlier(INPUT_DATA_NUMERICAL_TIMESTAMP,
                             INPUT_DATA_NUMERICAL_TIMESTAMP_DELTA));
  });

  // Test the isEarlier function with string values
  it('should recognise an earlier timestamp (both strings)', function() {

    assert.ok(time.isEarlier(INPUT_DATA_STRING_TIMESTAMP,
                             INPUT_DATA_STRING_TIMESTAMP_SINGULARITY));
  });

  // Test the isEarlier function with numerical and string values
  it('should recognise an earlier timestamp (number vs. string)', function() {
    assert.ok(time.isEarlier(INPUT_DATA_NUMERICAL_TIMESTAMP,
                             INPUT_DATA_STRING_TIMESTAMP_SINGULARITY));
  });

  // Test the isEarlier function with numerical and string values
  it('should recognise an earlier timestamp (string vs. number)', function() {
    assert.ok(time.isEarlier(INPUT_DATA_STRING_TIMESTAMP,
                             INPUT_DATA_NUMERICAL_TIMESTAMP_SINGULARITY));
  });

});
