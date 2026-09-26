<!-- BookIndex.vue -->
<template>
  <div class="row">
   <div style="margin-top: 5%">
     <h2>{{title}}</h2>
     <div v-if="message" class="notice">{{message}}</div>
     <div v-if="error" class="notice error">{{error}}</div>
     <table class="u-full-width"><thead>
       <tr>
         <th>Title</th>
         <th>Author</th>
         <th>Publisher</th>
         <th>Edition</th>
         <th class="text-center">Actions</th>
       </tr>
       </thead><tbody>
       <tr v-for='book in books' :key="book.id">
       <td>{{book.title}}</td>
       <td>{{book.author}}</td>
       <td>{{book.publisher}}</td>
       <td>{{book.edition}}</td>
       <td>
       <router-link class="button"
         :to="'/book/show/'+book.id">Show</router-link>
       &nbsp;
       <router-link class="button"
         :to="'/book/edit/'+book.id">Edit</router-link>
       &nbsp;
       <a class="button"
         v-on:click="deleteBook(book.id)">Erase</a>
       </td>
       </tr></tbody>
     </table>
     <router-link class="button button-primary"
       to="/book/create">New</router-link>
     <a class="button" style="float: right"
       v-on:click="runTasks()">Procesar cola (bookTasks)</a>
   </div>
  </div>
</template>

<script>
import { api } from '../api';

export default {
  name: "BookIndex",
  data() {
    return {
      title: 'Book List',
      books: [],
      message: this.$route.query.queued ? 'Solicitud enviada a la cola "bookstore". Se aplicará cuando se ejecute bookTasks.' : '',
      error: ''
    };
  },
  mounted() {
    this.allBooks();
  },
  methods: {
    allBooks() {
      api('bookFindAll')
        .then((items) => { this.books = items; })
        .catch((e) => { this.error = e.message; });
    },
    deleteBook(id) {
      api('bookDelete/' + id, { method: 'DELETE' })
        .then(() => {
          this.message = 'Eliminación enviada a la cola "bookstore". Se aplicará cuando se ejecute bookTasks.';
        })
        .catch((e) => { this.error = e.message; });
    },
    runTasks() {
      api('bookTasks')
        .then((result) => {
          this.message = `bookTasks procesó ${result.processed} mensaje(s).`;
          this.allBooks();
        })
        .catch((e) => { this.error = e.message; });
    }
  }
};
</script>
