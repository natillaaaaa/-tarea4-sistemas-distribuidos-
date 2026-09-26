<!-- PublisherIndex.vue -->
<template>
  <div class="row">
   <div style="margin-top: 5%">
     <h2>{{title}}</h2>
     <div v-if="message" class="notice">{{message}}</div>
     <div v-if="error" class="notice error">{{error}}</div>
     <table class="u-full-width"><thead>
       <tr>
         <th>Publisher</th>
         <th>Country</th>
         <th>Founded</th>
         <th>Genre</th>
         <th class="text-center">Actions</th>
       </tr>
       </thead><tbody>
       <tr v-for='publisher in publishers' :key="publisher.id">
       <td>{{publisher.publisher}}</td>
       <td>{{publisher.country}}</td>
       <td>{{publisher.founded}}</td>
       <td>{{publisher.genere}}</td>
       <td>
       <router-link class="button"
         :to="'/publisher/show/'+publisher.id">Show</router-link>
       &nbsp;
       <router-link class="button"
         :to="'/publisher/edit/'+publisher.id">Edit</router-link>
       &nbsp;
       <a class="button"
         v-on:click="deletePublisher(publisher.id)">Erase</a>
       </td>
       </tr></tbody>
     </table>
     <router-link class="button button-primary"
       to="/publisher/create">New</router-link>
     <a class="button" style="float: right"
       v-on:click="runTasks()">Procesar cola (publisherTasks)</a>
   </div>
  </div>
</template>

<script>
import { api } from '../api';

export default {
  name: "PublisherIndex",
  data() {
    return {
      title: 'Publisher List',
      publishers: [],
      message: this.$route.query.queued ? 'Solicitud enviada a la cola "publishers". Se aplicará cuando se ejecute publisherTasks.' : '',
      error: ''
    };
  },
  mounted() {
    this.allPublishers();
  },
  methods: {
    allPublishers() {
      api('publisherFindAll')
        .then((items) => { this.publishers = items; })
        .catch((e) => { this.error = e.message; });
    },
    deletePublisher(id) {
      api('publisherDelete/' + id, { method: 'DELETE' })
        .then(() => {
          this.message = 'Eliminación enviada a la cola "publishers". Se aplicará cuando se ejecute publisherTasks.';
        })
        .catch((e) => { this.error = e.message; });
    },
    runTasks() {
      api('publisherTasks')
        .then((result) => {
          this.message = `publisherTasks procesó ${result.processed} mensaje(s).`;
          this.allPublishers();
        })
        .catch((e) => { this.error = e.message; });
    }
  }
};
</script>
