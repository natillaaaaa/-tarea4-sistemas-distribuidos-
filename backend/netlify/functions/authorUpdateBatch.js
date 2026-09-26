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
      `UPDATE authors SET author = $2, nationality = $3, birth_year = $4, fields = $5
       WHERE id = $1`,
      [id, data.author, data.nationality, toInt(data.birth_year), data.fields]);

    return { statusCode: 200, headers, body: 'OK' };
  } catch (error) {
    console.log(error);
    return { statusCode: 422, headers, body: JSON.stringify({ error: error.message }) };
  }
};
