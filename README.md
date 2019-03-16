# Platform Event Stream

![npm](https://img.shields.io/npm/v/npm.svg) ![license](https://img.shields.io/npm/l/platform-event-stream.svg)

A small library that converts [Salesforce Platform Events](https://developer.salesforce.com/docs/atlas.en-us.platform_events.meta/platform_events/platform_events_intro.htm) converted into a [Readable Stream](https://nodejs.org/dist/latest-v6.x/docs/api/stream.html#stream_readable_streams) in [Object Mode](https://nodejs.org/api/stream.html#stream_object_mode).

```js
const through2 = require('through2');
const platformEventStream = require('platform-event-stream');

const jsonStream = through2.obj(function(chunk, encoding, callback) {
    this.push(JSON.stringify(chunk, null, 4) + '\n')
    callback()
});

platformEventStream({
    connection: {
        clientId: 'OAUTH_CLIENT_ID',
        clientSecret: 'OAUTH_CLIENT_SECRET',
        redirectUri: 'http://localhost:3000/oauth/_callback'
    },
    authentication: {
        username: 'user@example.com',
        password: 'password',
        securityToken: 'securityToken',
    },
    eventName: 'Event__e',
    logger: console
})
.pipe(jsonStream)
.pipe(process.stdout);
```

`Event__e` events will be piped to `stdout` (usually the console) as they are published from Salesforce.

# Installation

npm:
```bash
npm install platform-event-stream
```

Yarn:
```bash
yarn add platform-event-stream
```
# Usage

<b><code>platformEventStream(connection, authentication, options)</code></b>

Creates a Readable Stream in Object Mode for the `eventName` defined in `options`.

## options

* `connection`: Required, see, see notes below.
* `authentication`: Required, see notes below.
* `eventName`: Required, the API name of the Platform Event to subscribe to, e.g. `Event__e`
* `logger`: Optional, a custom logger. See: [Custom Logger](#Custom-Logger)
    * `info`: Required, implementation for the `logger.info()` method.
    * `error`: Required, implementation for the `logger.error()` method.

Details of the Org to connect to are provided in `connection`, and authentication details provided in `authentication`. As Platform Event Stream uses [`nforce`](https://github.com/kevinohara80/nforce) internally, these objects use the same format as those provided to `nforce`'s [`createConnection`](https://github.com/kevinohara80/nforce#createconnectionopts) and [`authenticate`](https://github.com/kevinohara80/nforce#authenticateopts-callback) methods respectively.

## Custom Logger

A custom logger object can be provided to output details about the stream and any errors that occur.

The logger object has the following interface:

```js
{
    info: (object [, object, ...]) => void,
    error: (object [, object, ...]) => void
}
```

The simple interface is designed so that you can pass most logging libraries (e.g. [bunyan](https://github.com/trentm/node-bunyan), [winston](https://github.com/winstonjs/winston)) or `console` directly, alternatively you can implement your own.

```js
const myLogger = {
    info: (...args) => (), // Don't bother outputting info messages
    error: (...args) => console.error(args),
}

platformEventStream({
    ...
    logger: myLogger,
    // logger: console
});
```

# License

[MIT](https://github.com/adtennant/platform-event-stream/blob/master/LICENSE)
