<template>
  <b-overlay :show="loading" style="min-height: 100vh;">
    <b-container v-if="project" class="my-4">
      <b-row style="font-size: 2rem;">
        <b>Project:</b>&nbsp;{{ project.title }}
        <span style="font-size: 1.3rem; margin: auto 1rem;" @click="openEditProjectModal">
          <FontAwesomeIcon :icon="faPenToSquare"></FontAwesomeIcon>
        </span>
      </b-row>
      <b-row v-if="project.description">
        {{ project.description }}
      </b-row>
      <b-row data-testid="project-creator">
        Created by {{ project.creatorId }}
      </b-row>
      <b-row>

      </b-row>
      <TaskDisplay :project="project"></TaskDisplay>
      <b-container>
      <b-row style="font-size: 1.4rem;" class="mt-4 border-bottom py-2">
        User List
      </b-row>
      <b-container class="py-2">
        <b-row><b>{{ project.creatorId }} &lpar;Creator&rpar;</b></b-row>
        <b-row 
          v-for="user in project.memberIds" >
          {{ user }}
        </b-row>
      </b-container>
    </b-container>
    </b-container>
    <b-modal v-model="showEditProjectModal" centered title="Edit Project">
      <b-form v-if="updateProject">
        <b-form-group
          label="Title"
          label-cols="3"
          label-for="update-project-title-input">
          <b-form-input
            id="update-project-title-input"
            v-model="updateProject.title">
          </b-form-input>
        </b-form-group>
        <b-form-group
          label="Description"
          label-cols="3"
          label-for="update-project-desc-input">
          <b-form-textarea
            id="update-project-desc-input"
            v-model="updateProject.description">
          </b-form-textarea>
        </b-form-group>
        <b-form-group
          label="Members"
          label-cols="3"
          label-for="update-project-members-input">
          <b-form-tags
            :value="updateUsers"
            @input="updateUsers = $event"
            id="update-project-members-input">
          </b-form-tags>
        </b-form-group>
      </b-form>
      <template #modal-footer>
        <b-button variant="outline-secondary" @click="closeEditProjectModal">Cancel</b-button>
        <b-button variant="primary" @click="handleUpdateProject">Save changes</b-button>
      </template>
    </b-modal>
  </b-overlay>
</template>

<script setup lang="ts">
import { ref, Ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { IProject, ITask } from '../types/mongo.types'

import TaskDisplay from '../components/TaskDisplay.vue'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'

const route = useRoute()

const loading = ref(false)
const project: Ref<IProject | null> = ref(null)
const updateProject: Ref<any> = ref(null)
const updateUsers: Ref<string[]> = ref([])

const projectTasks: Ref<ITask[]> = ref([])

const showEditProjectModal = ref(false)

const openEditProjectModal = () => { showEditProjectModal.value = true }
const closeEditProjectModal = () => { showEditProjectModal.value = false }

const handleUpdateProject = async () => {
  try {
    loading.value = true

    if (project.value && updateProject.value && updateUsers.value) {
      updateProject.value.memberIds = updateUsers.value

      await fetch(`/api/projects/${project.value._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateProject.value)
      })
    }

  } catch (error) {
    return
  }

  showEditProjectModal.value = false

  refresh()
}

const refresh = async () => {
  loading.value = true
  const res = await fetch(`/api/projects/${route.params.projectId}`)


  if (res.ok) {
    project.value = await res.json()
  }

  console.log(project.value)

  updateProject.value = {
    title: project.value?.title,
    description: project.value?.description,
  }

  if (project.value?.memberIds) updateUsers.value = project.value.memberIds.slice()

  const tasks = await fetch(`/api/projects/${route.params.projectId}/tasks`)

  if (tasks.ok) {
    projectTasks.value = await tasks.json()
  }

  loading.value = false
}

onMounted(() => {
  refresh()
})

</script>