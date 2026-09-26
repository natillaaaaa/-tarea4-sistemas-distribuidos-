<!-- AuthorDetails.vue -->
<template>
  <div class="row">
   <div class="eleven column" style="margin-top: 5%">
    <h2>{{title}}</h2>
    <div v-if="error" class="notice error">{{error}}</div>
     <form v-on:submit.prevent>
     <div class="row">
      <div class="six columns">
       <label>Author</label>
       <input class="u-full-width" type="text" :disabled="readonly"
         v-model="author.author">
      </div>
      <div class="six columns">
       <label>Nationality</label>
       <input class="u-full-width" type="text" :disabled="readonly"
          v-model="author.nationality">
      </div>
     </div>
     <div class="row">
      <div class="six columns">
       <label>Birth year</label>
       <input class="u-full-width" type="number" :disabled="readonly"
          v-model="author.birth_year">
      </div>
      <div class="six columns">
       <label>Fields</label>
       <input class="u-full-width" type="text" :disabled="readonly"
         v-model="author.fields">
      </div>
     </div>
     <div class="row">
      <router-link class="button button-primary"
        to="/author">Back</router-link>
       <a v-if='edit' class="button button-primary" style="float: right"
         v-on:click="updateAuthor(author.id)">Update</a>
       <a v-if='create' class="button button-primary" style="float: right"
         v-on:click="createAuthor()">Create</a>
       <a v-if='this.delete' class="button button-primary" style="float: right"
         v-on:click="deleteAuthor(author.id)">Delete</a>
     </div>
    </form>
  </div>
</div>
</template>

<script>
import { api, newId } from '../api';

export default {
  name: "AuthorDetails",
  props: ['show', 'edit', 'create', 'delete'],
  data() {
    return {
      title: "Author Data",
      author: {},
      error: ''
    }
  },
  computed: {
    readonly() { return this.show || this.delete; }
  },
  mounted() {
    if (this.$route.params.id != null)
      this.findAuthor(this.$route.params.id);
    else
      this.author = { id: newId(), author: '', nationality: '', birth_year: '', fields: '' };
  },
  methods: {
    findAuthor(id) {
      api('authorFind/' + id)
        .then((items) => {
          if (items.length) this.author = items[0];
          else this.error = 'El autor no existe (o aún no se ha procesado la cola).';
        })
        .catch((e) => { this.error = e.message; });
    },
    valid() {
      if (!this.author.author) {
        this.error = 'Debe indicar el nombre del autor.';
        return false;
      }
      return true;
    },
    queued() {
      this.$router.push({ path: '/author', query: { queued: 1 } });
    },
    updateAuthor(id) {
      if (!this.valid()) return;
      api('authorUpdate/' + id, { method: 'PUT', body: JSON.stringify(this.author) })
        .then(this.queued)
        .catch((e) => { this.error = e.message; });
    },
    createAuthor() {
      if (!this.valid()) return;
      api('authorInsert', { method: 'POST', body: JSON.stringify(this.author) })
        .then(this.queued)
        .catch((e) => { this.error = e.message; });
    },
    deleteAuthor(id) {
      api('authorDelete/' + id, { method: 'DELETE' })
        .then(this.queued)
        .catch((e) => { this.error = e.message; });
    }
  }
};
</script>
