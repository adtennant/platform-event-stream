const nforce = require('nforce');
const stream = require('stream');

const defaultLogger = {
  info: () => {},
  error: () => {},
};

class PlatformEventStream extends stream.Readable {
  constructor(options) {
    super({ objectMode: true, read: () => {} });

    if (!options.eventName) throw new Error('invalid or missing eventName');

    const connection = Object.assign(options.connection, { mode: 'single' });
    const logger = options.logger || defaultLogger;

    const org = nforce.createConnection(connection);

    org.authenticate(options.authentication)
      .then(() => {
        const client = org.createStreamClient();
        const events = client.subscribe({ topic: options.eventName, isEvent: true });

        events.on('connect', () => {
          logger.info(`Connected to ${options.eventName}`);
        });

        events.on('disconnect', () => {
          logger.info(`Disconnected from ${options.eventName}`);
          this.emit('end');
        });

        events.on('error', (error) => {
          logger.error(error);
          this.emit('error', error);
        });

        events.on('data', (data) => {
          logger.info('Received', data);
          this.push(data);
        });
      })
      .catch(logger.error);
  }
}

module.exports = options => new PlatformEventStream(options);
