"use strict";

// Obtiene el id numérico del final de la ruta: /.netlify/functions/authorFind/123
function getId(event) {
  const id = parseInt(event.path.split("/").reverse()[0]);
  if (!Number.isInteger(id)) throw new Error('Id inválido');
  return id;
}

// Convierte a entero; los campos vacíos del formulario se guardan como NULL
function toInt(value) {
  if (value === '' || value === null || value === undefined) return null;
  const n = parseInt(value);
  return Number.isNaN(n) ? null : n;
}

// URL base de las funciones batch. En Netlify, process.env.URL es la URL del sitio.
function functionsUrl() {
  return (process.env.API_URL || process.env.URL) + '/.netlify/functions/';
}

module.exports = { getId, toInt, functionsUrl };
