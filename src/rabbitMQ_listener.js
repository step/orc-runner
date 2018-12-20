import amqp from 'amqplib';
import logger from './logger';

export default (config, onMessageReceivedCallback) => {
  const getRabbitMQServerURL = () => {
    return `amqp://${config.serverURL}`;
  };

  const ackToChannel = channel => {
    return message => {
      onMessageReceivedCallback(message.content.toString());
      channel.ack(message);
    };
  };

  const getRoutingKey = () => {
    return `#.${config.routingKey}.#`;
  };

  const getQueueName = () => {
    return `${config.routingKey}_queue`;
  };

  amqp
    .connect(getRabbitMQServerURL())
    .then(connection => {
      return connection.createChannel();
    })
    .then(channel => {
      channel.assertExchange(config.exchange, config.exchangeType, {
        durable: true
      });
      if (config.prefetch) {
        let prefetchLimit = config.prefetchLimit || 0;
        channel.prefetch(prefetchLimit);
      }
      return Promise.all([
        channel.assertQueue(getQueueName(), { durable: true }),
        channel
      ]);
    })
    .then(args => {
      const q = args[0];
      const channel = args[1];
      logger.logWaitingMessage(config.routingKey);
      channel.bindQueue(q.queue, config.exchange, getRoutingKey());
      channel.consume(q.queue, ackToChannel(channel), { noAck: false });
    });
};
