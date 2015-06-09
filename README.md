reelib
======

Library for common reelyActive methods.  Currently includes:
- time
- identifier


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

Create an identifier object with the given type and value.

### convertType(identifier, newType)

Create a new identifier object of the given type from the given identifier object.  For example:

    var newIdentifier = reelib.identifier.convertType(oldIdentifier, TYPE_EUI64);



What's next?
------------

This is an active work in progress.  Expect regular changes and updates, as well as improved documentation!


License
-------

MIT License

Copyright (c) 2015 reelyActive

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN 
THE SOFTWARE.

