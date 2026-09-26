<!-- AuthorIndex.vue -->
<template>
  <div class="row">
   <div style="margin-top: 5%">
     <h2>{{title}}</h2>
     <div v-if="message" class="notice">{{message}}</div>
     <div v-if="error" class="notice error">{{error}}</div>
     <table class="u-full-width"><thead>
       <tr>
         <th>Author</th>
         <th>Nationality</th>
         <th>Birth year</th>
         <th>Fields</th>
         <th class="text-center">Actions</th>
       </tr>
       </thead><tbody>
       <tr v-for='author in authors' :key="author.id">
       <td>{{author.author}}</td>
       <td>{{author.nationality}}</td>
       <td>{{author.birth_year}}</td>
       <td>{{author.fields}}</td>
       <td>
       <router-link class="button"
         :to="'/author/show/'+author.id">Show</router-link>
       &nbsp;
       <router-link class="button"
         :to="'/author/edit/'+author.id">Edit</router-link>
       &nbsp;
       <a class="button"
         v-on:click="deleteAuthor(author.id)">Erase</a>
       </td>
       </tr></tbody>
     </table>
     <router-link class="button button-primary"
       to="/author/create">New</router-link>
     <a class="button" style="float: right"
       v-on:click="runTasks()">Procesar cola (authorTasks)</a>
   </div>
  </div>
</template>

<script>
import { api } from '../api';

export default {
  name: "AuthorIndex",
  data() {
    return {
      title: 'Author List',
      authors: [],
      message: this.$route.query.queued ? 'Solicitud enviada a la cola "authors". Se aplicará cuando se ejecute authorTasks.' : '',
      error: ''
    };
  },
  mounted() {
    this.allAuthors();
  },
  methods: {
    allAuthors() {
      api('authorFindAll')
        .then((items) => { this.authors = items; })
        .catch((e) => { this.error = e.message; });
    },
    deleteAuthor(id) {
      api('authorDelete/' + id, { method: 'DELETE' })
        .then(() => {
          this.message = 'Eliminación enviada a la cola "authors". Se aplicará cuando se ejecute authorTasks.';
        })
        .catch((e) => { this.error = e.message; });
    },
    runTasks() {
      api('authorTasks')
        .then((result) => {
          this.message = `authorTasks procesó ${result.processed} mensaje(s).`;
          this.allAuthors();
        })
        .catch((e) => { this.error = e.message; });
    }
  }
};
</script>
