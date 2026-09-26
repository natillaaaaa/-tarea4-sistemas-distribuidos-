"use strict";

// Habilita CORS para que el frontend (publicado en otro dominio) pueda llamar a las funciones
module.exports = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'content-type',
  'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS'
};
