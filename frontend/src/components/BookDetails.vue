<!-- BookDetails.vue -->
<template>
  <div class="row">
   <div class="eleven column" style="margin-top: 5%">
    <h2>{{title}}</h2>
    <div v-if="error" class="notice error">{{error}}</div>
     <form v-on:submit.prevent>
     <div class="row">
      <div class="six columns">
       <label>Title</label>
       <input class="u-full-width" type="text" :disabled="readonly"
         v-model="book.title">
      </div>
      <div class="six columns">
       <label>Author</label>
       <select class="u-full-width" :disabled="readonly"
         v-model="book.author_id" v-on:change="selectAuthor">
         <option :value="null">-- Seleccione --</option>
         <option v-for="a in authors" :key="a.id" :value="a.id">{{a.author}}</option>
       </select>
      </div>
     </div>
     <div class="row">
      <div class="six columns">
       <label>Publisher</label>
       <select class="u-full-width" :disabled="readonly"
         v-model="book.publisher_id" v-on:change="selectPublisher">
         <option :value="null">-- Seleccione --</option>
         <option v-for="p in publishers" :key="p.id" :value="p.id">{{p.publisher}}</option>
       </select>
      </div>
      <div class="six columns">
       <label>Edition</label>
       <input class="u-full-width" type="text" :disabled="readonly"
         v-model="book.edition">
      </div>
     </div>
     <div class="row">
      <div class="four columns">
       <label>Copyright</label>
       <input class="u-full-width" type="number" :disabled="readonly"
          v-model="book.copyright">
      </div>
      <div class="four columns">
       <label>Language</label>
       <input class="u-full-width" type="text" :disabled="readonly"
         v-model="book.language">
      </div>
      <div class="four columns">
       <label>Pages</label>
       <input class="u-full-width" type="number" :disabled="readonly"
         v-model="book.pages">
      </div>
     </div>
     <div class="row">
      <router-link class="button button-primary"
        to="/book">Back</router-link>
       <a v-if='edit' class="button button-primary" style="float: right"
         v-on:click="updateBook(book.id)">Update</a>
       <a v-if='create' class="button button-primary" style="float: right"
         v-on:click="createBook()">Create</a>
       <a v-if='this.delete' class="button button-primary" style="float: right"
         v-on:click="deleteBook(book.id)">Delete</a>
     </div>
    </form>
  </div>
</div>
</template>

<script>
import { api, newId } from '../api';

export default {
  name: "BookDetails",
  props: ['show', 'edit', 'create', 'delete'],
  data() {
    return {
      title: "Book Data",
      book: {},
      authors: [],
      publishers: [],
      error: ''
    }
  },
  computed: {
    readonly() { return this.show || this.delete; }
  },
  mounted() {
    api('authorFindAll').then((items) => { this.authors = items; });
    api('publisherFindAll').then((items) => { this.publishers = items; });

    if (this.$route.params.id != null)
      this.findBook(this.$route.params.id);
    else {
      this.book = {
        id: newId(), title: '', edition: '', copyright: '', language: '', pages: '',
        author: '', author_id: null, publisher: '', publisher_id: null };
    }
  },
  methods: {
    // Guarda también el nombre (desnormalizado) para mostrarlo en la lista
    selectAuthor() {
      const a = this.authors.find((x) => x.id === this.book.author_id);
      this.book.author = a ? a.author : '';
    },
    selectPublisher() {
      const p = this.publishers.find((x) => x.id === this.book.publisher_id);
      this.book.publisher = p ? p.publisher : '';
    },
    findBook(id) {
      api('bookFind/' + id)
        .then((items) => {
          if (items.length) this.book = items[0];
          else this.error = 'El libro no existe (o aún no se ha procesado la cola).';
        })
        .catch((e) => { this.error = e.message; });
    },
    valid() {
      if (!this.book.title) {
        this.error = 'Debe indicar el título.';
        return false;
      }
      return true;
    },
    queued() {
      this.$router.push({ path: '/book', query: { queued: 1 } });
    },
    updateBook(id) {
      if (!this.valid()) return;
      api('bookUpdate/' + id, { method: 'PUT', body: JSON.stringify(this.book) })
        .then(this.queued)
        .catch((e) => { this.error = e.message; });
    },
    createBook() {
      if (!this.valid()) return;
      api('bookInsert', { method: 'POST', body: JSON.stringify(this.book) })
        .then(this.queued)
        .catch((e) => { this.error = e.message; });
    },
    deleteBook(id) {
      api('bookDelete/' + id, { method: 'DELETE' })
        .then(this.queued)
        .catch((e) => { this.error = e.message; });
    }
  }
};
</script>
