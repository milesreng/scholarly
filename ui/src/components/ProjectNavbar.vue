<template>
  <div class="d-flex flex-row py-2 px-3 justify-content-between" style="width: 100%; ">
    <div>
      <b-dropdown variant="outline-secondary" size="sm" split>
        <template #button-content v-if="props.project">
          <a :href="'/dashboard/' + props.project._id" style="text-decoration: none; color: black;">
            {{ props.project.title }}
          </a>
        </template>   
        <template #button-content v-else>
          <span style="font-size: 1rem !important;">
            Select a project
          </span>
        </template>
        <b-dropdown-item v-for="project in userProjects" :href="'/dashboard/' + project._id">
            {{ project.title }}
        </b-dropdown-item>  
        <b-dropdown-divider></b-dropdown-divider>
        <b-dropdown-item @click="() => openModal()">
          <FontAwesomeIcon :icon="faSquarePlus"></FontAwesomeIcon>
          Create new project
        </b-dropdown-item>
      </b-dropdown>
    </div>
    <div class="d-flex flex-row align-items-center" style="gap: 2rem;" v-if="props.project">
      <a :href="'/dashboard/' + props.project._id + '/tasks'">Tasks</a>
      <span>Chat</span>
      <span v-if="admin">Group Settings</span>
    </div>
    <b-modal v-model="showModal" title="Create New Project" centered content-class="font-roboto">
      <b-form>
        <b-form-group
          id="project-title-group"
          label="Title"
          label-for="project-title-input"
          label-cols="3">
          <b-form-input
            id="project-title-input"
            v-model="newProject.title"
            required></b-form-input>
        </b-form-group>
        <b-form-group
          id="project-title-group"
          label="Description"
          label-for="project-title-input"
          label-cols="3">
          <b-form-textarea
            id="project-title-input"
            v-model="newProject.description"
            required></b-form-textarea>
        </b-form-group>
      </b-form>
    </b-modal>
  </div>
</template>

<script setup lang="ts">
import { Ref, ref, computed, inject } from 'vue'
import { IProject } from '../../../server/models/project.model'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faSquarePlus } from '@fortawesome/free-regular-svg-icons'

interface Props {
  project: IProject | null
}

const props = defineProps<Props>()

const user: Ref<any> = inject('user')!
const userProjects: Ref<IProject[]> = inject('userProjects')!
const newProject: Ref<IProject> = ref({
  title: '',
  description: '',
  memberIds: '',
  adminIds: ''
})

const showModal = ref(false)

const admin = computed(() => {
  if (props.project) return props.project.adminIds.includes(user.value.preferred_username)
  return false
})

const openModal = () => { showModal.value = true }

const handleCreateProject = async () => {
  await fetch('/api/projects', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST'
  })
}

</script>