"use strict"

const headers = require('../../lib/headersCORS');
const { connect } = require('../../lib/rabbitMQ');
const { functionsUrl } = require('../../lib/utils');

const queue = 'authors';

exports.handler = async (event, context) => {

  if (event.httpMethod == "OPTIONS") {
    return { statusCode: 200, headers, body: "OK" };
  }

  let conn;
  try {
    const url = functionsUrl();
    const rabbit = await connect(queue);
    conn = rabbit.conn;
    const channel = rabbit.channel;

    let processed = 0;
    // noAck: false -> el mensaje solo se elimina de la cola cuando la función batch responde bien
    let message = await channel.get(queue, { noAck: false });
    while (message) {
      let request = {};
      try {
        request = JSON.parse(message.content.toString());
      } catch (e) {
        // Un mensaje mal formado cae en el default y se descarta
      }
      let response = null;
      switch (request.method) {
        case "DELETE":
          response = await fetch(url + 'authorDeleteBatch/' + request.id, {
            method: "DELETE",
            headers: { "Content-type": "application/json" } });
          break;
        case "UPDATE":
          response = await fetch(url + 'authorUpdateBatch/' + request.id, {
            method: "PUT",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(request.body) });
          break;
        case "INSERT":
          response = await fetch(url + 'authorInsertBatch', {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(request.body) });
          break;
        default:
          console.log('Mensaje desconocido, se descarta:', message.content.toString());
      }

      if (response && !response.ok) {
        // Se devuelve el mensaje a la cola para reintentarlo en la próxima ejecución
        channel.nack(message, false, true);
        throw new Error(`${request.method} falló (${response.status}): ${await response.text()}`);
      }
      channel.ack(message);
      processed++;
      message = await channel.get(queue, { noAck: false });
    }

    return { statusCode: 200, headers, body: JSON.stringify({ processed }) };
  } catch (error) {
    console.log(error);
    return { statusCode: 422, headers, body: JSON.stringify({ error: error.message }) };
  } finally {
    if (conn) await conn.close();
  }
};
