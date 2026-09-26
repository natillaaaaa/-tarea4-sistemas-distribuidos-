"use strict"

const pool = require('../../lib/db');
const headers = require('../../lib/headersCORS');
const { getId } = require('../../lib/utils');

exports.handler = async (event, context) => {

  if (event.httpMethod == "OPTIONS") {
    return { statusCode: 200, headers, body: "OK" };
  }

  try {
    const id = getId(event);

    await pool.query('DELETE FROM publishers WHERE id = $1', [id]);

    return { statusCode: 200, headers, body: 'OK' };
  } catch (error) {
    console.log(error);
    return { statusCode: 422, headers, body: JSON.stringify({ error: error.message }) };
  }
};
