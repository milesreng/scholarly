<template>
  <a :href="'/projects/' + props.project._id" 
    class="border shadow py-2 px-4 d-flex flex-row justify-content-between align-items-center project" 
    style="text-decoration: none; color: black;">
    <div class="d-flex flex-column">
      <span style="font-size: 1.2rem;">
        {{ project.title }}
      </span>
      <span style="font-size: 0.8rem; color: #5a5a5a;">
        {{ project.description }}
      </span>
    </div>
    <span>
      Creator: {{ project.creatorId }}
    </span>
  </a>
</template>

<script setup lang="ts">
import { IProject } from '../../../server/models/project.model'

interface Props {
  project: IProject
}

const props = defineProps<Props>()

</script>