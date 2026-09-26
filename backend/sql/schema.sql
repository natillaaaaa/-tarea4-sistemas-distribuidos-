-- Esquema de la base de datos bookstore (PostgreSQL)
-- Ejecutar una vez en el SQL Editor de Neon/Supabase (o con psql).
--
-- Los ids los genera el frontend (igual que en el tutorial), porque el registro
-- se inserta de forma diferida cuando la función *Tasks procesa la cola.
-- author_id / publisher_id no tienen FOREIGN KEY: como el procesamiento es
-- diferido, un libro podría llegar antes que su autor.

CREATE TABLE IF NOT EXISTS authors (
  id           INTEGER PRIMARY KEY,
  author       TEXT NOT NULL,
  nationality  TEXT,
  birth_year   INTEGER,
  fields       TEXT
);

CREATE TABLE IF NOT EXISTS publishers (
  id         INTEGER PRIMARY KEY,
  publisher  TEXT NOT NULL,
  country    TEXT,
  founded    INTEGER,
  genere     TEXT
);

CREATE TABLE IF NOT EXISTS books (
  id            INTEGER PRIMARY KEY,
  title         TEXT NOT NULL,
  edition       TEXT,
  copyright     INTEGER,
  language      TEXT,
  pages         INTEGER,
  author        TEXT,
  author_id     INTEGER,
  publisher     TEXT,
  publisher_id  INTEGER
);

-- Datos de ejemplo
INSERT INTO authors (id, author, nationality, birth_year, fields) VALUES
  (1, 'Abraham Silberschatz', 'Israelis / American', 1952, 'Database Systems, Operating Systems'),
  (2, 'Andrew S. Tanenbaum', 'Dutch / American', 1944, 'Distributed computing, Operating Systems')
ON CONFLICT (id) DO NOTHING;

INSERT INTO publishers (id, publisher, country, founded, genere) VALUES
  (1, 'John Wiley & Sons', 'United States', 1807, 'Academic'),
  (2, 'Pearson Education', 'United Kingdom', 1844, 'Education')
ON CONFLICT (id) DO NOTHING;

INSERT INTO books (id, title, edition, copyright, language, pages, author, author_id, publisher, publisher_id) VALUES
  (1, 'Operating System Concepts', '9th', 2012, 'English', 976, 'Abraham Silberschatz', 1, 'John Wiley & Sons', 1),
  (2, 'Database System Concepts', '6th', 2010, 'English', 1376, 'Abraham Silberschatz', 1, 'John Wiley & Sons', 1),
  (3, 'Computer Networks', '5th', 2010, 'English', 960, 'Andrew S. Tanenbaum', 2, 'Pearson Education', 2),
  (4, 'Modern Operating Systems', '4th', 2014, 'English', 1136, 'Andrew S. Tanenbaum', 2, 'Pearson Education', 2)
ON CONFLICT (id) DO NOTHING;
