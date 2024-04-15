<template>
  <b-overlay :show="loading" style="min-height: 100vh;">
    <div class="sub-navbar" style="margin: 0; width: 100%;">
      <ProjectNavbar :project="selectedProject"></ProjectNavbar>
    </div>
    <b-container v-if="selectedProject" class="py-4">
      <b-row style="align-items: end">
        <Clock></Clock>
      </b-row>
      <b-container>
        <b-row class="my-2">
          Filters
        </b-row>
        <b-row class="d-flex">
          <div v-if="projectTasks" class="p-2 d-flex flex-column" style="gap: .5rem; width: 100%;">
            <b-row style="width: 100%;">
              <b-col cols="3">Title</b-col>
              <b-col cols="3">Description</b-col>
              <b-col cols="2">Status</b-col>
              <b-col cols="2">Assigned to</b-col>
              <b-col cols="2"></b-col>
            </b-row>
            <b-row v-for="task in projectTasks" style="width: 100%;">
              <b-col cols="3" @click="openViewTaskModal">{{ task.title }}</b-col>
              <b-col cols="3">{{ task.description }}</b-col>
              <b-col cols="2">{{ task.status }}</b-col>
              <b-col cols="2">{{ task.userIds }}</b-col>
              <b-col cols="2">
                <FontAwesomeIcon :icon="faPenToSquare"></FontAwesomeIcon> 
              </b-col>
            </b-row>
            <div class="my-2" style="width: 100%; height: .1rem; background-color: #e1e1e1;"></div>
            <span @click="openCreateTaskModal">
              <FontAwesomeIcon :icon="faSquarePlus"></FontAwesomeIcon>
              Add new task
            </span>
          <b-modal v-model="showViewTaskModal" centered size="lg" title="View Task">
            <b-container v-if="modalTask">
              <b-row>{{ modalTask.title }}</b-row>
              <b-row>{{ modalTask.creatorId }}</b-row>
              <b-row>{{ modalTask.userIds }}</b-row>
              <div class="my-2" style="width: 100%; height: .1rem; background-color: #e1e1e1;"></div>
              <b-row>{{ modalTask.status }}</b-row>
              <b-row>{{ modalTask.description }}</b-row>
            </b-container>
          </b-modal>
          </div>
        </b-row>
      </b-container>
      <b-modal v-model="showCreateTaskModal" centered title="Create Task">
        <b-form>
          <b-form-group
            label="Title"
            label-cols="3"
            label-for="task-title-input">
            <b-form-input
              id="task-title-input"
              v-model="createTask.title">
            </b-form-input>
          </b-form-group>
          <b-form-group
            label="Description"
            label-cols="3"
            label-for="task-desc-input">
            <b-form-textarea
              id="task-desc-input"
              v-model="createTask.description">
            </b-form-textarea>
          </b-form-group>
          <b-form-group
            label="Description"
            label-cols="3"
            label-for="task-desc-input">
            <b-form-textarea
              id="task-desc-input"
              v-model="createTask.description">
            </b-form-textarea>
          </b-form-group>
        </b-form>
      </b-modal>
    </b-container>
    <b-container v-else-if="loading">
    </b-container>
    <b-container v-else>
      404 project not found
    </b-container>
  </b-overlay>
</template>

<script setup lang="ts">
import { Ref, ref, computed, inject, onMounted } from 'vue'
import Clock from '../components/Clock.vue'
import ProjectNavbar from '../components/ProjectNavbar.vue'

import { IUser } from '../../../server/models/user.model'
import { IProject } from '../../../server/models/project.model'
import { ITask } from '../../../server/models/task.model'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faSquarePlus, faPenToSquare } from '@fortawesome/free-regular-svg-icons'

interface Props {
  projectId: string
}

const props = withDefaults(defineProps<Props>(), { projectId: ''})

const userProjects: Ref<IProject[]> = inject('userProjects')!
const projectTasks: Ref<ITask[]> = ref([])
const projectUsers: Ref<IUser[]> = ref([])

const modalTask: Ref<ITask | null> = ref(null)
const createTask: Ref<any> = ref({
  title: '', description: '', userIds: [], projectId: '', status: 'not-started'
})

const loading = ref(false)
const showViewTaskModal = ref(false)
const showCreateTaskModal = ref(false)

const selectedProject = computed(() => {
  if (props.projectId) return userProjects.value.find((project) => project._id === props.projectId) || null
  return null
})

const openViewTaskModal = (idx: number) => {
  if (idx < projectTasks.value.length) {
    modalTask.value = projectTasks.value[idx]
  }

  showViewTaskModal.value = true
}

const openCreateTaskModal = () => { showCreateTaskModal.value = true }

onMounted(async () => {
  const tasks = await fetch(`/api/projects/${props.projectId}/tasks`)

  if (!tasks.ok) return
  projectTasks.value = await tasks.json() 

  if (projectTasks.value.length > 0) modalTask.value = projectTasks.value[0]

  const users = await fetch(`/api/projects/${props.projectId}/users`)
  if (!users.ok) return

  projectUsers.value = await users.json()
})

</script>