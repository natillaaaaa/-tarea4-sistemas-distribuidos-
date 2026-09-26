"use strict"

const pool = require('../../lib/db');
const headers = require('../../lib/headersCORS');

exports.handler = async (event, context) => {

  if (event.httpMethod == "OPTIONS") {
    return { statusCode: 200, headers, body: "OK" };
  }

  try {
    const { rows } = await pool.query('SELECT * FROM publishers ORDER BY publisher');

    return { statusCode: 200, headers, body: JSON.stringify(rows) };
  } catch (error) {
    console.log(error);
    return { statusCode: 400, headers, body: JSON.stringify({ error: error.message }) };
  }
};
