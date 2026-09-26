// Acceso a las funciones de Netlify (backend)
export const API = (import.meta.env.VITE_API_URL || '') + '/.netlify/functions/';

export async function api(fn, options = {}) {
  const response = await fetch(API + fn, {
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    ...options
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`${fn}: ${response.status} ${text}`);
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

// Id generado en el cliente, igual que en el tutorial (el insert es diferido)
export function newId() {
  return Math.floor(Math.random() * 100000000);
}
