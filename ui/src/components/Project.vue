<template>
  <router-link v-if="props.project" :to="{name: 'project', params: { projectId: props.project._id }}">
    <b-container class="border shadow p-4 d-flex flex-row justify-content-between" style="width: 100%; text-decoration: none; color: black;">
      <b-row>
        {{ props.project.title }}
        {{ props.project }}
      </b-row>
    </b-container>
  </router-link>
</template>
<script setup lang="ts">
import { IProject } from '../types/mongo.types'

interface Props {
  project: IProject
}

const props = defineProps<Props>()

</script>