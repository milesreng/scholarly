<template>
  <div class="border shadow py-2 px-4 d-flex flex-row justify-content-between align-items-center">
    <span style="font-size: 1.2rem;">
      {{ project.title }}
    </span>
    <span>
      Creator: {{ project.creatorId }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { IProject } from '../../../server/models/project.model'

interface Props {
  project: IProject
}

const props = defineProps<Props>()

</script>