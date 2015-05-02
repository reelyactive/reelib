reelib
======

Library for common reelyActive methods.


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

__toTimestamp(timestamp)__

Convert the given timestamp into the standard numerical format (number of milliseconds since January 1st, 1970, expressed as a number).

__getCurrent()__

Get the current timestamp in standard numerical format.

__getCurrentISO()__

Get the current timestamp as an ISO8601 String.

__getFuture(milliseconds)__

Get the timestamp, in standard numerical format, which is the given number of milliseconds in the future.

__getCurrentOffset(timestamp)__

Get the offset, in milliseconds, between the current and given timestamps.  Accepts timestamps in both the standard numerical format and the String format.

__toFuture(timestamp, milliseconds)__

Return the given timestamp, in standard numerical format, advanced in the future by the given number of milliseconds.  Accepts timestamps in both the standard numerical format and the String format.

__isInPast(timestamp)__

Return whether the given timestamp is in the past.  Accepts timestamps in both the standard numerical format and the String format.

__isEarlier(timestamp1, timestamp2)__

Return whether the first given timestamp is earlier than the second.  Accepts timestamps in both the standard numerical format and the String format.


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

