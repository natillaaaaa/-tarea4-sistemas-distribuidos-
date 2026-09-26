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
      `UPDATE publishers SET publisher = $2, country = $3, founded = $4, genere = $5
       WHERE id = $1`,
      [id, data.publisher, data.country, toInt(data.founded), data.genere]);

    return { statusCode: 200, headers, body: 'OK' };
  } catch (error) {
    console.log(error);
    return { statusCode: 422, headers, body: JSON.stringify({ error: error.message }) };
  }
};
