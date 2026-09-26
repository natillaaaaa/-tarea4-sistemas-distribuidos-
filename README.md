# Tarea 4 — Bookstore con RabbitMQ (CloudAMQP) y PostgreSQL

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


Formato de los mensajes (JSON):

```json
{ "method": "INSERT", "body": { "id": 123, "author": "..." } }
{ "method": "UPDATE", "id": 123, "body": { ... } }
{ "method": "DELETE", "id": 123 }
```

