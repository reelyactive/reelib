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
var INPUT_DATA_ASSOCIATIONIDS = {
  "identifier": {
    "value": "001bc50940000000",
    "type": "EUI-64",
    "advData": {
      "complete128BitUUIDs": "7265656c794163746976652055554944",
      "nonComplete128BitUUIDs": "adabfb006e7d4601bda2bffaa68956ba",
      "complete16BitUUIDs": "feed",
      "nonComplete16BitUUIDs": "fee7fee0",
      "manufacturerSpecificData": {
        "companyIdentifierCode": "004c",
        "iBeacon": {
          "uuid": "8deefbb9f7384297804096668bb44281",
          "major": "0001",
          "minor": "2258",
        }
      },
      "serviceData": {
        "eddystone": {
          "uid": {
            "namespace": "8b0ca750095477cb3e77",
            "instance": "001122334455"
          },
          "eid": "1122334455667788"
        },
        "estimote": {
          "id": "11223344556677"
        }
      },
      "leBluetoothDeviceAddress": "00094b74fd13d0"
    }
  }
};
var INPUT_DATA_NULL = null;
var INPUT_DATA_EMPTY = {};
var INPUT_DATA_REELYACTIVE = {
  "identifier": {
    "type": "ADVA-48",
    "value": "ec24b84d0000",
    "advHeader": {
      "type": "ADV_DISCOVER_IND",
      "length": 27,
      "txAdd": "public",
      "rxAdd": "public"
    },
    "advData": {
      "flags": [
        "LE General Discoverable Mode",
        "BR/EDR Not Supported"
      ],
      "complete128BitUUIDs": "7265656c794163746976652055554944"
    }
  },
  "timestamp": "2014-01-01T01:23:45.678Z",
  "radioDecodings": [
    {
      "rssi": 128,
      "identifier": {
        "type": "EUI-64",
        "value": "001bc50940810000"
      }
    }
  ]
};


// Expected outputs for the scenario
var EXPECTED_DATA_TIMESTAMP = 1388539425678;
var EXPECTED_DATA_DEVICEID = '001bc50940100000';
var EXPECTED_DATA_RECEIVERID = '001bc50940800000';
var EXPECTED_DATA_ASSOCIATIONIDS = [
    '00094b74fd13d0', '8b0ca750095477cb3e77001122334455',
    '8deefbb9f7384297804096668bb4428100012258', '11223344556677',
    '1122334455667788', '7265656c794163746976652055554944',
    'adabfb006e7d4601bda2bffaa68956ba', 'feed', 'fee7', 'fee0', '004c',
    '001bc5094' ];
var EXPECTED_DATA_RSSI = 128;
var EXPECTED_DATA_VALID = true;
var EXPECTED_DATA_NULL = false;
var EXPECTED_DATA_EMPTY = false;
var EXPECTED_DATA_REELYACTIVE = true;
var EXPECTED_DATA_FLATTENED = { time: 1388539425678,
                                deviceId: '001bc50940100000',
                                deviceAssociationIds: [ '001bc5094' ],
                                receiverId: '001bc50940800000',
                                rssi: 128 };
var EXPECTED_DATA_SHORT_STRING = 'dID: 001bc50940100000 rID: 001bc50940800000 rssi: 128 at 20:23:45.678';
var EXPECTED_DATA_CSV_STRING = '20:23:45.678,001bc50940100000,001bc50940800000,128';


// Describe the scenario
describe('tiraid', function() {

  // Test the getTimestamp function with a valid tiraid
  it('should return the timestamp of the tiraid', function() {
    assert.strictEqual(tiraid.getTimestamp(INPUT_DATA_VALID),
                       EXPECTED_DATA_TIMESTAMP);
  });

  // Test the getDeviceId function with a valid tiraid
  it('should return the deviceId of the tiraid', function() {
    assert.strictEqual(tiraid.getDeviceId(INPUT_DATA_VALID),
                       EXPECTED_DATA_DEVICEID);
  });

  // Test the getReceiverId function with a valid tiraid
  it('should return the strongest receiverId of the tiraid', function() {
    assert.strictEqual(tiraid.getReceiverId(INPUT_DATA_VALID),
                       EXPECTED_DATA_RECEIVERID);
  });

  // Test the getAssociationIds function with an associaitons tiraid
  it('should return the association ids of the tiraid', function() {
    assert.deepEqual(tiraid.getAssociationIds(INPUT_DATA_ASSOCIATIONIDS),
                     EXPECTED_DATA_ASSOCIATIONIDS);
  });

  // Test the getRSSI function with a valid tiraid
  it('should return the strongest rssi of the tiraid', function() {
    assert.strictEqual(tiraid.getRSSI(INPUT_DATA_VALID),
                       EXPECTED_DATA_RSSI);
  });

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

  // Test the isReelyActiveTransmission function with a reelyActive tiraid
  it('should assert that a reelyActive tiraid is reelyActive', function() {
    assert.strictEqual(tiraid.isReelyActiveTransmission(
                          INPUT_DATA_REELYACTIVE), EXPECTED_DATA_REELYACTIVE);
  });

  // Test the toFlattened function with a valid tiraid
  it('should convert the tiraid to a flattened object', function() {
    assert.deepEqual(tiraid.toFlattened(INPUT_DATA_VALID),
                     EXPECTED_DATA_FLATTENED);
  });

  // Test the toShortString function with a valid tiraid
  it('should convert the tiraid to a short string (EST!)', function() {
    assert.strictEqual(tiraid.toShortString(INPUT_DATA_VALID),
                       EXPECTED_DATA_SHORT_STRING);
  });

  // Test the toCSVString function with a valid tiraid
  it('should convert the tiraid to a CSV string (EST!)', function() {
    assert.strictEqual(tiraid.toCSVString(INPUT_DATA_VALID),
                       EXPECTED_DATA_CSV_STRING);
  });

});
