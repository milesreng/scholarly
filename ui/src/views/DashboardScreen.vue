<template>
  <div class="container py-4">
    <b-overlay :show="loading">
      <h1>Dashboard</h1>
      <!-- <div v-if="user">
        {{ user.preferred_username }}
      </div> -->
    </b-overlay>
  </div>
</template>

<script setup lang="ts">
import { Ref, ref, onMounted } from 'vue'

const loading = ref(false)

</script>