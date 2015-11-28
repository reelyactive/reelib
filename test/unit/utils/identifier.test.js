/**
 * Copyright reelyActive 2015
 * We believe in an open Internet of Things
 */

var identifier = require("../../../lib/utils/identifier.js");
var assert = require ('assert'); 


// Inputs for the scenario
var INPUT_DATA_EUI64 = '001bc50940100000';
var INPUT_DATA_RA28 = '0100000';
var INPUT_DATA_ADVA48 = 'fee150bada55';
var INPUT_DATA_COLON_CAPS = 'FE:E1:50:BA:DA:55';
var INPUT_DATA_HYPHEN_UUID = '7265656c-7941-6374-6976-652055554944';
var INPUT_DATA_WRONG_LENGTH = '1234567980';
var INPUT_DATA_ADVA48_IDENTIFIER = { type: identifier.ADVA48,
                                     value: INPUT_DATA_COLON_CAPS };
var INPUT_DATA_RADIO_PAYLOAD = { value: '',
                                 length: 10 };
var INPUT_DATA_RA28_IDENTIFIER = { type: identifier.RA28,
                                   value: INPUT_DATA_RA28 };
var INPUT_DATA_VALID = { type: identifier.ADVA48,
                         value: INPUT_DATA_ADVA48 };
var INPUT_DATA_NULL = null;
var INPUT_DATA_EMPTY = {};

// Expected outputs for the scenario
var EXPECTED_DATA_EUI64 = { type: identifier.EUI64,
                            value: INPUT_DATA_EUI64 };
var EXPECTED_DATA_RA28 = { type: identifier.RA28,
                           value: INPUT_DATA_RA28 };
var EXPECTED_DATA_ADVA48 = { type: identifier.ADVA48,
                             value: INPUT_DATA_ADVA48 };
var EXPECTED_DATA_COLON_CAPS = 'fee150bada55';
var EXPECTED_DATA_HYPHEN_UUID = '7265656c794163746976652055554944';
var EXPECTED_DATA_WRONG_LENGTH = null;
var EXPECTED_DATA_ADVA48_IDENTIFIER = EXPECTED_DATA_COLON_CAPS;
var EXPECTED_DATA_RADIO_PAYLOAD = { type: identifier.RADIO_PAYLOAD,
                                    value: INPUT_DATA_RADIO_PAYLOAD.value,
                                    length: INPUT_DATA_RADIO_PAYLOAD.length };
var EXPECTED_DATA_UNDEFINED = { type: identifier.UNDEFINED,
                                value: null };
var EXPECTED_DATA_VALID = true;
var EXPECTED_DATA_NULL = false;
var EXPECTED_DATA_EMPTY = false;


// Describe the scenario
describe('identifier', function() {

  // Test the toIdentifier function with a valid EUI-64
  it('should create an EUI-64 identifier', function() {
    assert.deepEqual(identifier.toIdentifier(identifier.EUI64,
                                             INPUT_DATA_EUI64),
                     EXPECTED_DATA_EUI64);
  });

  // Test the toIdentifier function with a valid RA-28
  it('should create an RA-28 identifier', function() {
    assert.deepEqual(identifier.toIdentifier(identifier.RA28,
                                             INPUT_DATA_RA28),
                     EXPECTED_DATA_RA28);
  });

  // Test the toIdentifier function with an RA-28 that's an EUI-64
  it('should create an RA-28 identifier', function() {
    assert.deepEqual(identifier.toIdentifier(identifier.RA28,
                                             INPUT_DATA_EUI64),
                     EXPECTED_DATA_RA28);
  });

  // Test the toIdentifier function with a valid ADVA-48
  it('should create an ADVA-48 identifier', function() {
    assert.deepEqual(identifier.toIdentifier(identifier.ADVA48,
                                             INPUT_DATA_ADVA48),
                     EXPECTED_DATA_ADVA48);
  });

  // Test the toIdentifier function with invalid inputs
  it('should create an undefined identifier', function() {
    assert.deepEqual(identifier.toIdentifier(null, null),
                     EXPECTED_DATA_UNDEFINED);
  });

  // Test the toIdentifierString function with colon-separated caps
  it('should create a valid ADVA48 identifier string', function() {
    assert.strictEqual(identifier.toIdentifierString(INPUT_DATA_COLON_CAPS),
                       EXPECTED_DATA_COLON_CAPS);
  });

  // Test the toIdentifierString function with hyphenated UUID
  it('should create a valid UUID identifier string', function() {
    assert.strictEqual(identifier.toIdentifierString(INPUT_DATA_HYPHEN_UUID),
                       EXPECTED_DATA_HYPHEN_UUID);
  });

  // Test the toIdentifierString function with invalid length input
  it('should assert that an wrong-length identifier is invalid', function() {
    assert.strictEqual(identifier.toIdentifierString(INPUT_DATA_WRONG_LENGTH),
                       EXPECTED_DATA_WRONG_LENGTH);
  });

  // Test the toIdentifierString function with identifier object
  it('should create a valid ADVA48 identifier string', function() {
    assert.strictEqual(identifier.toIdentifierString(
                       INPUT_DATA_ADVA48_IDENTIFIER),
                       EXPECTED_DATA_ADVA48_IDENTIFIER);
  });

  // Test the convertType function with RA-28 to EUI-64
  it('should convert a RA-28 to EUI-64', function() {
    assert.deepEqual(identifier.convertType(INPUT_DATA_RA28_IDENTIFIER,
                                            identifier.EUI64),
                     EXPECTED_DATA_EUI64);
  });

  // Test the isValid function with a valid identifier
  it('should assert that a valid identifier is valid', function() {
    assert.strictEqual(identifier.isValid(INPUT_DATA_VALID),
                       EXPECTED_DATA_VALID);
  });

  // Test the isValid function with a null identifier
  it('should assert that a null identifier is invalid', function() {
    assert.strictEqual(identifier.isValid(INPUT_DATA_NULL),
                       EXPECTED_DATA_NULL);
  });

  // Test the isValid function with an empty identifier
  it('should assert that an empty identifier is invalid', function() {
    assert.strictEqual(identifier.isValid(INPUT_DATA_EMPTY),
                       EXPECTED_DATA_EMPTY);
  });

});
