reelib
======

Library for common reelyActive methods.  Currently includes:
- [time](#time-library)
- [identifier](#identifier-library)
- [tiraid](#tiraid-library)
- [event](#event-library)
- [reel](#reel-library)


Installation
------------

    npm install reelib


Hello reelib
------------

```javascript
var reelib = require('reelib');

console.log("Right now it is " + reelib.time.getCurrentISO());
```


Time library
------------

A numerical timestamp (milliseconds since January 1st, 1970, expressed as a number) is used for _internal_ processing and storage because this format is concise and allows for efficient storage, manipulations and comparisons.  An ISO8601 timestamp string is used for everything else because it's a human-readable global standard (ex: 2014-01-01T01:23:45.678Z).

The following are accessible under _reelib.time_:

### toTimestamp(timestamp)

Convert the given timestamp into the standard numerical format (number of milliseconds since January 1st, 1970, expressed as a number).  For example:

    reelib.time.toTimestamp('2015-01-01T01:23:45.678Z');
    reelib.time.toTimestamp(1420075425678);

would both yield 1420075425678.

### getCurrent()

Get the current timestamp in standard numerical format.

### getCurrentISO()

Get the current timestamp as an ISO8601 String.  For example:

    reelib.time.getCurrentISO();

would yield something like '2015-01-01T01:23:45.678Z'.

### getFuture(milliseconds)

Get the timestamp, in standard numerical format, which is the given number of milliseconds in the future.

### getCurrentOffset(timestamp)

Get the offset, in milliseconds, between the current and given timestamps.  Accepts timestamps in both the standard numerical format and the String format.

### toFuture(timestamp, milliseconds)

Return the given timestamp, in standard numerical format, advanced in the future by the given number of milliseconds.  Accepts timestamps in both the standard numerical format and the String format.

### isInPast(timestamp)

Return whether the given timestamp is in the past.  Accepts timestamps in both the standard numerical format and the String format.

### isEarlier(timestamp1, timestamp2)

Return whether the first given timestamp is earlier than the second.  Accepts timestamps in both the standard numerical format and the String format.

### isValid(timestamp)

Returns whether the given timestamp is valid or not.

### toLocalTimeOfDay(timestamp)

Returns the timestamp as a human-readable String representing the time of day on the local machine, ex: 12:34:56.789

### toLocalTwelveDigitString(timestamp)

Returns the timestamp as a twelve-digit String representing the time of day on the local machine, in the format YYMMDDHHMMSS, ex: 160101123456


Identifier library
------------------

Identifiers have a type and a value, both of which are expressed as strings.  Some identifier types may have additional fields which are generated automatically by the toIdentifier() function.

The following are accessible under _reelib.identifier_:

### Constants

- EUI64: 'EUI-64'
- RA28: 'RA-28'
- ADVA48: 'ADVA-48'
- RADIO_PAYLOAD: 'RadioPayload'
- UNDEFINED: 'Undefined'

### toIdentifier(type, value)

Create an identifier object with the given type and value.  For example:

    {
      type: 'ADVA-48',
      value: 'fee150bada55'
    }

### toIdentifierString(identifier)

Convert the given identifier (as string or object) to a _valid_ identifier string, if possible, otherwise return null.  A valid identifier string is:
- hexadecimal characters only (no separators)
- all lowercase
- 16, 48, 64 or 128 bits in length

For example:

     reelib.identifier.toIdentifierString('FE:E1:50:BA:DA:55');

would return 'fee150bada55'.

### convertType(identifier, newType)

Create a new identifier object of the given type from the given identifier object.  For example:

    var newIdentifier = reelib.identifier.convertType(oldIdentifier, TYPE_EUI64);

### isValid(identifier)

Returns whether the given identifier (as string or object) is valid or not.

### isMatch(identifiers1, identifiers2)

Returns whether there is a common identifier among the two inputs or not.  Each input can be either an identifier string or and array of identifier strings.


Tiraid library
--------------

Tiraids have a [timestamp](#time-library), radioDecodings and an [identifier](#identifier-library).

The following are accessible under _reelib.tiraid_:

### Constants

- CSV_HEADER: 'Timestamp,TransmitterID,ReceiverID,RSSI'

### getTimestamp(tiraid)

Returns the timestamp of the given tiraid as per the [toTimestamp(timestamp)](#totimestamptimestamp) function.

### getDeviceId(tiraid)

Returns the device identifier of the given tiraid as per the [toIdentifierString(identifier)](#toidentifierstringidentifier) function.

### getReceiverId(tiraid)

Returns the strongest receiver identifier of the given tiraid as per the [toIdentifierString(identifier)](#toidentifierstringidentifier) function.

### getAssociationIds(tiraid)

Returns an array of all association identifiers embedded in the identifier payload of the given tiraid as per the [toIdentifierString(identifier)](#toidentifierstringidentifier) function.

### getRSSI(tiraid)

Returns the RSSI of the stongest receiver of the given tiraid.

### isValid(tiraid)

Returns whether the given tiraid is valid or not.

### isReelyActiveTransmission(tiraid)

Returns whether the given tiraid represents a wireless transmission by a reelyActive device or not.

### toFlattened(tiraid)

Returns the tiraid as a flattened object.  For example:

    {
      time: 1420075425678,
      deviceId: "001bc50940100000",
      receiverId: "001bc50940800000",
      rssi: 128
    }

### toShortString(tiraid)

Returns the tiraid as a human-readable String expected to fit on a single line (less than 80 characters).  For example:

    dID: 001bc50940100000 rID: 001bc50940800000 rssi: 128 +1r at 01:23:45.678

### toCSVString(tiraid)

Returns the tiraid as a Comma-Separated Values (CSV) String.  For example:

    01:23:45.678,001bc50940100000,001bc50940800000,128


Event library
-------------

Events have an event (appearance, displacement, keep-alive or disappearance) and [tiraid](#tiraid-library).

The following are accessible under _reelib.event_:

### Constants

- APPEARANCE: 'appearance'
- DISPLACEMENT: 'displacement'
- KEEPALIVE: 'keep-alive'
- DISAPPEARANCE: 'disappearance'
- EVENTS_ROUTE_NAME: 'events'
- CSV_HEADER: 'Timestamp,TransmitterID,ReceiverID,RSSI,Events'

### getEvent(tiraid)

Returns the type of event.

### isValid(event)

Returns whether the given event is valid or not.

### isPass(event, accept, reject)

Returns whether the given event meets the accept criteria while not meeting the reject criteria.  Each criteria is structured as follows:

    {
      deviceIds: [ /* IDs which meet the criteria */ ],
      receiverIds: [ /* IDs which meet the criteria */ ],
      rssi: { minimum: #, maximum: # }
    }

Not all of the above properties need to be included.  Note that no event can meet an empty criteria of {}!  To ignore either or both the accept/reject criteria, set these to _null_ instead.

### postUpdate(options, event, callback)

POSTs the given event to a remote server.  The following options are supported (those shown are the defaults):

    {
      hostname: "www.hyperlocalcontext.com",
      port: 80,
      timeout: 10000,
      logToConsole: false
    }

To use a proxy server, add the following to the options:

    proxy: 'http://my.proxy.name'

The callback returns the error (if any), the original event, and the response message (if any).  For example:

```javascript
var options = { /* See above */ };
var event = { event: 'appearance', tiraid: tiraid };

reelib.event.postUpdate(options, event, function(err, event, message) {
  /* Handle the callback */
});
```

### toFlattened(event)

Returns the event as a flattened object.  For example:

    {
      event: "appearance",
      time: 1420075425678,
      deviceId: "001bc50940100000",
      receiverId: "001bc50940800000",
      rssi: 128
    }

### toCSVString(event)

Returns the event as a Comma-Separated Values (CSV) String.  For example:

    01:23:45.678,001bc50940100000,001bc50940800000,128,appearance

### eventqueue

A simple event queue class which accepts tiraids and generates events, if applicable, in the callback.  The following options are supported (those shown are the defaults):

    {
      keepAliveMilliseconds: 5000,
      disappearanceMilliseconds: 15000
    }

```javascript
var options = { /* See above */ };
var eventqueue = new reelib.event.eventqueue(options);

eventqueue.insert(tiraid, function(event) {
  if(event) { /* Do something with the event */ }
});
```


Reel library
------------

Methods specific to the reelyActive sensor reel architecture are contained in this library.

The following are accessible under _reelib.reel_:

### putStatusUpdate(options, event, callback)

PUTs the given reel status event to a remote server.  The following options are supported (those shown are the defaults):

    {
      hostname: "www.hyperlocalcontext.com",
      port: 80,
      timeout: 10000,
      logToConsole: false
    }

To use a proxy server, add the following to the options:

    proxy: 'http://my.proxy.name'

The callback returns the error (if any), the original event, and the response message (if any).  For example:

```javascript
var options = { /* See above */ };
var event = { type: 'reelceiverStatistics', ... };

reelib.reel.putStatusUpdate(options, event, function(err, event, message) {
  /* Handle the callback */
});
```


What's next?
------------

This is an active work in progress.  Expect regular changes and updates, as well as improved documentation!


License
-------

MIT License

Copyright (c) 2015-2016 reelyActive

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN 
THE SOFTWARE.

