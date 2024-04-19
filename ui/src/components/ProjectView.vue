<template>
  <b-overlay :show="loading">
  <b-button @click="refresh">Refresh</b-button>
  <b-container v-if="project" class="d-flex flex-column pb-4" style="gap: .5rem;">
    <b-row style="border-bottom: 1px solid grey; width: 100%;" class="d-flex flex-row align-items-center">
      <b-col class="p-2 d-flex flex-column" cols="10">
        <span style="font-size: 2rem; ">{{ project.title }}</span>
        <span style="font-size: 1rem;">
          Created <span v-if="project.createdAt"> on {{ formatDate(project.createdAt)}}</span>
          by {{ project.creatorId }}
        </span>
      </b-col>
      <b-col class="text-right">
        <b-button variant="danger" @click="openDeleteModal">
          <FontAwesomeIcon :icon="faTrashCan"></FontAwesomeIcon>
        </b-button>
      </b-col>
    </b-row>
    <b-row class="align-items-center border px-2 py-1 rounded" style="width: fit-content;" @click="openModal">
      <FontAwesomeIcon :icon="faSquarePlus" class="pr-2"></FontAwesomeIcon> Create a task
    </b-row>
    <b-row class="d-flex flex-column" style="gap: .5rem; margin: 0; padding: 0; height: fit-content; gap: 1rem;">
      <Task v-for="task in projectTasks" :userOptions="userOptions" :task="task" @delete="refresh"></Task>
    </b-row>
    <b-modal v-model="showCreateModal" centered title="Create Task">
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
            label="Due Date"
            label-cols="3"
            label-for="task-date-input">
            <b-form-datepicker
              id="task-date-input"
              v-model="createTask.dueDate">
            </b-form-datepicker>
          </b-form-group>
          <b-form-group
            label="Assign to"
            label-cols="3"
            label-for="task-assign-input">
            <b-form-select
              id="task-assign-input"
              multiple
              v-model="createTask.userIds"
              :options="userOptions">
            </b-form-select>
          </b-form-group>
        </b-form>
          <template #modal-footer>
            <b-button @click="closeModal">Cancel</b-button>
            <b-button variant="primary" @click="handleCreateTask">Create task</b-button>
          </template>
    </b-modal>
    <b-modal v-model="showConfirmDeleteModal" centered size="sm">
      Are you sure you want to delete this project?
      <template #modal-footer>
        <b-button @click="closeDeleteModal">Cancel</b-button>
        <b-button variant="danger" @click="handleDeleteProject">Yes</b-button>
      </template>
    </b-modal>
  </b-container>
  </b-overlay>
</template>

<script setup lang="ts">
import { ref, Ref, computed, onMounted } from 'vue'
import { router } from '../main'
import Task from './Task.vue'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faSquarePlus, faTrashCan } from '@fortawesome/free-regular-svg-icons'

import { DropdownOption } from '../types/options.types'
import { ITask } from '../../../server/models/task.model'
import { IProject } from '../../../server/models/project.model'

interface Props {
  project: IProject
}

const props = defineProps<Props>()
const emit = defineEmits(['deleteProject'])

const projectTasks: Ref<ITask[]> = ref([])
const userOptions = computed(() => {
  const options = props.project.memberIds.map((member: string) => {return { value: member, text: member }})

  return [...options, { value: props.project.creatorId , text: props.project.creatorId }]
})

const showCreateModal = ref(false)
const showConfirmDeleteModal = ref(false)
const loading = ref(false)

const createTask: Ref<any> = ref({
  title: '', description: '', userIds: [], projectId: props.project._id, status: 'not-started', dueDate: new Date()
})

const openDeleteModal = () => { showConfirmDeleteModal.value = true }
const closeDeleteModal = () => { showConfirmDeleteModal.value = false }

const openModal = () => { showCreateModal.value = true }
const closeModal = () => { showCreateModal.value = false }

const handleCreateTask = async () => {
  loading.value = true
  const res = await fetch('/api/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(createTask.value)
  })

  loading.value = false

  if (res.ok) {
    closeModal()
    refresh()
  }
}

const handleDeleteProject = async () => {
  const res = await fetch(`/api/projects/${props.project._id}`, {
    method: 'DELETE'
  })

  if (res) router.push({ path: '/projects' })
}

const formatDate = (date: string | null) => {
  if (date) {
    return new Date(date).toLocaleDateString()
  }
  return '-'
}

const refresh = async () => {
  if (props.project) {
    loading.value = true
    const res = await fetch(`/api/projects/${props.project._id}/tasks`)

    projectTasks.value = await res.json()
    loading.value = false
  }
}

onMounted(async () => {
  refresh()
})

</script>