"use strict"

const pool = require('../../lib/db');
const headers = require('../../lib/headersCORS');
const { toInt } = require('../../lib/utils');

exports.handler = async (event, context) => {

  if (event.httpMethod == "OPTIONS") {
    return { statusCode: 200, headers, body: "OK" };
  }

  try {
    const data = JSON.parse(event.body);

    // ON CONFLICT: si el mensaje se procesa dos veces no se duplica el registro
    await pool.query(
      `INSERT INTO books (id, title, edition, copyright, language, pages, author, author_id, publisher, publisher_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       ON CONFLICT (id) DO NOTHING`,
      [toInt(data.id), data.title, data.edition, toInt(data.copyright), data.language, toInt(data.pages), data.author, toInt(data.author_id), data.publisher, toInt(data.publisher_id)]);

    return { statusCode: 200, headers, body: 'OK' };
  } catch (error) {
    console.log(error);
    return { statusCode: 422, headers, body: JSON.stringify({ error: error.message }) };
  }
};
