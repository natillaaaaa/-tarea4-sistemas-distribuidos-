"use strict"

const pool = require('../../lib/db');
const headers = require('../../lib/headersCORS');
const { getId, toInt } = require('../../lib/utils');

exports.handler = async (event, context) => {

  if (event.httpMethod == "OPTIONS") {
    return { statusCode: 200, headers, body: "OK" };
  }

  try {
    const id = getId(event);
    const data = JSON.parse(event.body);

    await pool.query(
      `UPDATE books SET title = $2, edition = $3, copyright = $4, language = $5, pages = $6, author = $7, author_id = $8, publisher = $9, publisher_id = $10
       WHERE id = $1`,
      [id, data.title, data.edition, toInt(data.copyright), data.language, toInt(data.pages), data.author, toInt(data.author_id), data.publisher, toInt(data.publisher_id)]);

    return { statusCode: 200, headers, body: 'OK' };
  } catch (error) {
    console.log(error);
    return { statusCode: 422, headers, body: JSON.stringify({ error: error.message }) };
  }
};
