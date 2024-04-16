<template>
  
  <div v-if="props.status == 'not-started'"
    class="rounded-pill px-4"
    style="background-color: #ffaaaa; width: fit-content; opacity: 0.9;">
    Not started
  </div>
  <div v-else-if="props.status === 'in-progress'"
    class="px-2 rounded-pill px-4"
    style="background-color: #ffffaa; width: fit-content; opacity: 0.9;">
    In progress
  </div>
  <div v-else
    class="px-2 rounded-pill px-4"
    style="background-color: #aaffaa; width: fit-content; opacity: 0.9;">
    Complete
  </div>
</template>

<script setup lang="ts">

interface Props {
  status: string
}

const props = defineProps<Props>()
</script>