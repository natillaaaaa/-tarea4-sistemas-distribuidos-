<!-- PublisherDetails.vue -->
<template>
  <div class="row">
   <div class="eleven column" style="margin-top: 5%">
    <h2>{{title}}</h2>
    <div v-if="error" class="notice error">{{error}}</div>
     <form v-on:submit.prevent>
     <div class="row">
      <div class="six columns">
       <label>Publisher</label>
       <input class="u-full-width" type="text" :disabled="readonly"
         v-model="publisher.publisher">
      </div>
      <div class="six columns">
       <label>Country</label>
       <input class="u-full-width" type="text" :disabled="readonly"
          v-model="publisher.country">
      </div>
     </div>
     <div class="row">
      <div class="six columns">
       <label>Founded</label>
       <input class="u-full-width" type="number" :disabled="readonly"
          v-model="publisher.founded">
      </div>
      <div class="six columns">
       <label>Genre</label>
       <input class="u-full-width" type="text" :disabled="readonly"
         v-model="publisher.genere">
      </div>
     </div>
     <div class="row">
      <router-link class="button button-primary"
        to="/publisher">Back</router-link>
       <a v-if='edit' class="button button-primary" style="float: right"
         v-on:click="updatePublisher(publisher.id)">Update</a>
       <a v-if='create' class="button button-primary" style="float: right"
         v-on:click="createPublisher()">Create</a>
       <a v-if='this.delete' class="button button-primary" style="float: right"
         v-on:click="deletePublisher(publisher.id)">Delete</a>
     </div>
    </form>
  </div>
</div>
</template>

<script>
import { api, newId } from '../api';

export default {
  name: "PublisherDetails",
  props: ['show', 'edit', 'create', 'delete'],
  data() {
    return {
      title: "Publisher Data",
      publisher: {},
      error: ''
    }
  },
  computed: {
    readonly() { return this.show || this.delete; }
  },
  mounted() {
    if (this.$route.params.id != null)
      this.findPublisher(this.$route.params.id);
    else
      this.publisher = { id: newId(), publisher: '', country: '', founded: '', genere: '' };
  },
  methods: {
    findPublisher(id) {
      api('publisherFind/' + id)
        .then((items) => {
          if (items.length) this.publisher = items[0];
          else this.error = 'La editorial no existe (o aún no se ha procesado la cola).';
        })
        .catch((e) => { this.error = e.message; });
    },
    valid() {
      if (!this.publisher.publisher) {
        this.error = 'Debe indicar el nombre de la editorial.';
        return false;
      }
      return true;
    },
    queued() {
      this.$router.push({ path: '/publisher', query: { queued: 1 } });
    },
    updatePublisher(id) {
      if (!this.valid()) return;
      api('publisherUpdate/' + id, { method: 'PUT', body: JSON.stringify(this.publisher) })
        .then(this.queued)
        .catch((e) => { this.error = e.message; });
    },
    createPublisher() {
      if (!this.valid()) return;
      api('publisherInsert', { method: 'POST', body: JSON.stringify(this.publisher) })
        .then(this.queued)
        .catch((e) => { this.error = e.message; });
    },
    deletePublisher(id) {
      api('publisherDelete/' + id, { method: 'DELETE' })
        .then(this.queued)
        .catch((e) => { this.error = e.message; });
    }
  }
};
</script>
