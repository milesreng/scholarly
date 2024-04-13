<template>
  <div v-if="user">
    <b-container class="py-2 my-4" style="background-color: #eeeeee;">
      {{ user.name }}
    </b-container>
  </div>
</template>

<script setup lang="ts">
import { Ref, ref, inject } from 'vue'

const user: Ref<any> = inject('user')!

</script>