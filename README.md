# Tarea 4 — Bookstore con RabbitMQ (CloudAMQP) y PostgreSQL

Basado en el [Tutorial9](https://github.com/armando-arce/Tutoriales-Distribuidos/tree/main/Tutorial9),
pero con **PostgreSQL** en lugar de MongoDB y con autores y editoriales completos.

## Enlaces

| | URL |
|---|---|
| **Frontend** (Vercel) | https://bookstore-tarea4-nath.vercel.app |
| **Backend** (Netlify) | https://bookstore-tarea4-nath.netlify.app |
| Repositorio | https://github.com/natillaaaaa/-tarea4-sistemas-distribuidos- |

Funciones para invocar manualmente (procesan la cola correspondiente):

- https://bookstore-tarea4-nath.netlify.app/.netlify/functions/bookTasks
- https://bookstore-tarea4-nath.netlify.app/.netlify/functions/authorTasks
- https://bookstore-tarea4-nath.netlify.app/.netlify/functions/publisherTasks

Consultas directas a la base de datos:

- https://bookstore-tarea4-nath.netlify.app/.netlify/functions/bookFindAll
- https://bookstore-tarea4-nath.netlify.app/.netlify/functions/authorFindAll
- https://bookstore-tarea4-nath.netlify.app/.netlify/functions/publisherFindAll

Servicios usados: **CloudAMQP** (RabbitMQ, plan Little Lemur) y **Neon** (PostgreSQL, AWS us-east-1).

```
backend/    Funciones de Netlify (se publica en Netlify)
  lib/                 db.js (PostgreSQL), rabbitMQ.js, headersCORS.js, utils.js
  netlify/functions/   27 funciones (9 por entidad)
  sql/schema.sql       Tablas + datos de ejemplo
frontend/   Vue 3 + Vite (se publica en Vercel o GitHub Pages)
```

## Arquitectura (procesamiento diferido)

```
Frontend ──PUT/POST/DELETE──► xUpdate / xInsert / xDelete ──mensaje──► cola RabbitMQ
                                                                           │
             (se invoca manualmente)  xTasks ◄──── lee mensajes ───────────┘
                                        │
                                        └──► xUpdateBatch / xInsertBatch / xDeleteBatch ──► PostgreSQL
Frontend ──GET──► xFindAll / xFind ──────────────────────────────────────────────────────► PostgreSQL
```

| Entidad    | Cola         | Encolan                                      | Batch (escriben en la BD)                                   | Consumidor       |
|------------|--------------|----------------------------------------------|-------------------------------------------------------------|------------------|
| Libros     | `bookstore`  | `bookInsert`, `bookUpdate`, `bookDelete`     | `bookInsertBatch`, `bookUpdateBatch`, `bookDeleteBatch`     | `bookTasks`      |
| Autores    | `authors`    | `authorInsert`, `authorUpdate`, `authorDelete` | `authorInsertBatch`, `authorUpdateBatch`, `authorDeleteBatch` | `authorTasks`    |
| Editoriales| `publishers` | `publisherInsert`, `publisherUpdate`, `publisherDelete` | `publisherInsertBatch`, `publisherUpdateBatch`, `publisherDeleteBatch` | `publisherTasks` |

Cada entidad tiene **su propia cola**. Si todas usaran `bookstore`, `bookTasks` consumiría
también los mensajes de autores y editoriales.

Formato de los mensajes (JSON):

```json
{ "method": "INSERT", "body": { "id": 123, "author": "..." } }
{ "method": "UPDATE", "id": 123, "body": { ... } }
{ "method": "DELETE", "id": 123 }
```

### Cambios respecto al Tutorial9

- MongoDB → PostgreSQL (`pg`), con consultas parametrizadas (`$1, $2...`).
- Los mensajes se generan con `JSON.stringify`. El original usaba comillas simples
  (`{'method':'DELETE'}`), que **no es JSON válido**, y `JSON.parse` fallaba en `bookTasks`.
- `bookDelete` devolvía una variable `status` que no existía; ahora devuelve `'OK'`.
- La conexión a RabbitMQ se cierra después de cada envío (el plan gratuito de CloudAMQP limita las conexiones).
- `xTasks` usa `ack` manual: si una función batch falla, el mensaje **vuelve a la cola** en lugar de perderse.
- La URL de las funciones batch ya no está fija en el código; se usa `process.env.URL` de Netlify.
- Se usa `_id` → `id` (columna SQL).

---

## 1. CloudAMQP (punto 1 de la tarea)

1. Cree una cuenta en <https://www.cloudamqp.com> y una instancia gratuita (plan *Little Lemur*).
2. Abra la instancia. En **Details**, copie la **AMQP URL** (`amqps://...`).
3. Presione **RabbitMQ Manager** → pestaña **Queues and Streams** → *Add a new queue*:
   - Name: `bookstore`, Durability: **Durable** → *Add queue*.
   - Opcional: cree también `authors` y `publishers`. Si no las crea, las funciones las crean solas.
4. Para verificar que llegan los mensajes: haga una operación desde el frontend (o con `curl`).
   Luego, en el Rabbit Manager, entre a la cola → **Get messages** → *Ack mode: Nack message requeue true* → **Get Message(s)**.
   Así ve el mensaje sin sacarlo de la cola.

## 2. Base de datos PostgreSQL (Neon)

1. Cree una cuenta en <https://neon.tech> y un proyecto.
2. En **SQL Editor**, pegue y ejecute el contenido de `backend/sql/schema.sql`.
3. En **Connection string**, copie la URL (`postgresql://...?sslmode=require`).

## 3. Backend en Netlify (punto 4)

```bash
cd backend
npm install
netlify login
netlify init            # "Create & configure a new site"; build command vacío, publish dir: public
netlify env:set DATABASE_URL  "postgresql://...?sslmode=require"
netlify env:set CLOUDAMQP_URL "amqps://..."
netlify deploy --prod
```

Pruebe abriendo `https://SU-SITIO.netlify.app/.netlify/functions/bookFindAll`.

**Desarrollo local:** copie `backend/.env.example` a `backend/.env`, complete los valores y agregue
`API_URL=http://localhost:8888`. Luego ejecute `netlify dev`.

## 4. Frontend en Vercel o GitHub Pages (punto 4)

```bash
cd frontend
npm install
echo "VITE_API_URL=https://SU-SITIO.netlify.app" > .env
npm run build           # genera frontend/dist
```

- **Vercel:** `vercel --prod`, desde `frontend/`. Framework: Vite; output: `dist`.
  Agregue la variable `VITE_API_URL` en *Settings → Environment Variables* y vuelva a desplegar.
- **GitHub Pages:** suba el contenido de `frontend/dist` a la rama `gh-pages`, o use una GitHub Action.
  Funciona en cualquier subruta porque el router usa *hash history* (`/#/book`) y Vite usa `base: './'`.

## 5. Prueba manual del flujo completo (punto 5)

1. En el frontend, vaya a **Books** → **Edit** en un libro → cambie el título → **Update**.
   Aparece el aviso "Solicitud enviada a la cola", y la lista **todavía muestra el título viejo**.
2. En el **Rabbit Manager** → Queues → `bookstore`: *Ready* = 1. Con **Get messages**
   (modo *Nack requeue true*) se ve el JSON `{"method":"UPDATE","id":...,"body":{...}}`.
3. Invoque manualmente `bookTasks`, de cualquiera de estas formas:
   - En el navegador: `https://SU-SITIO.netlify.app/.netlify/functions/bookTasks`
   - Con curl: `curl https://SU-SITIO.netlify.app/.netlify/functions/bookTasks`
   - Con el botón **Procesar cola (bookTasks)** de la lista de libros.

   Responde `{"processed":1}`, y en el Rabbit Manager la cola queda en 0.
4. Verifique el cambio en la base de datos:
   - Recargue la lista de libros, o abra `bookFindAll`.
   - O en el SQL Editor de Neon: `SELECT id, title FROM books;`

Lo mismo aplica para autores (`authors` / `authorTasks`) y editoriales (`publishers` / `publisherTasks`).

> Si un mensaje hace fallar la función batch (por ejemplo, datos inválidos), `xTasks` responde 422
> y el mensaje queda en la cola. Para descartarlo, use **Purge Messages** en el Rabbit Manager.
