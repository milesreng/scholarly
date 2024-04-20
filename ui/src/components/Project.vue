<template>
  <router-link v-if="props.project" :to="{name: 'project', params: { projectId: props.project._id }}">
    <b-container class="border shadow p-4 d-flex flex-row justify-content-between" style="width: 100%; text-decoration: none; color: black;">
      <b-row class="d-flex flex-column">
        <span style="font-size: 1.3rem;">{{ props.project.title }}</span>
        <span>{{ props.project.description }}</span>
      </b-row>
      <b-row>
        <span class="m-auto">Created by {{ props.project.creatorId}}</span>
      </b-row>
    </b-container>
  </router-link>
</template>

<script setup lang="ts">
import { ref } from 'vue' 
import { IProject } from '../types/mongo.types'

interface Props {
  project: IProject
}

const props = defineProps<Props>()

const showMembersList = ref(false)

</script>