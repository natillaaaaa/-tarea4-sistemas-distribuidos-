"use strict";

const amqp = require('amqplib');

// Abre una conexión con CloudAMQP y un canal con confirmaciones de publicación.
async function connect(queue) {
  const conn = await amqp.connect(process.env.CLOUDAMQP_URL);
  const channel = await conn.createConfirmChannel();
  await channel.assertQueue(queue, { durable: true });
  return { conn, channel };
}

// Envía un mensaje (objeto JS) a la cola y espera a que RabbitMQ lo confirme.
// La conexión se cierra siempre para no agotar el límite de conexiones del plan gratuito.
async function sendMessage(queue, message) {
  const { conn, channel } = await connect(queue);
  try {
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)),
      { persistent: true, contentType: 'application/json' });
    await channel.waitForConfirms();
  } finally {
    await conn.close();
  }
}

module.exports = { connect, sendMessage };
