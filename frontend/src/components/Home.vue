<!-- Home.vue -->
<template>
  <div>
    <h2 style="margin-top: 15px">Bookstore Example Site</h2>
    <p>This website offers information on books, authors and publishers.</p>
    <ul>
      <li><router-link to='/book'>Books information</router-link></li>
      <li><router-link to='/author'>Authors information</router-link></li>
      <li><router-link to='/publisher'>Publishers information</router-link></li>
    </ul>
    <p>
      Las operaciones de agregar, modificar y eliminar se procesan en forma
      <strong>diferida</strong>: se envían a una cola de RabbitMQ y se aplican a la
      base de datos cuando se ejecuta la función <code>*Tasks</code> correspondiente.
    </p>
  </div>
</template>
