"use strict";

const { Pool } = require('pg');

// Un solo pool por instancia de la función. La cadena de conexión de Neon/Supabase
// ya incluye ?sslmode=require, por lo que pg activa SSL automáticamente.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 1
});

module.exports = pool;
