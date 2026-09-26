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
      `INSERT INTO authors (id, author, nationality, birth_year, fields)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (id) DO NOTHING`,
      [toInt(data.id), data.author, data.nationality, toInt(data.birth_year), data.fields]);

    return { statusCode: 200, headers, body: 'OK' };
  } catch (error) {
    console.log(error);
    return { statusCode: 422, headers, body: JSON.stringify({ error: error.message }) };
  }
};
