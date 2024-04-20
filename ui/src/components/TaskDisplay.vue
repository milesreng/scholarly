<template>
  <b-overlay :show="loading">
    <b-container>
      <b-row style="font-size: 1.4rem;" class="mt-4 border-bottom py-2">
        Task List
      </b-row>
      <b-container class="py-2">
        <b-row @click="() => openCreateTaskModal()" class="align-items-center border rounded px-2" style="width: fit-content;">
          <FontAwesomeIcon class="pr-2" :icon="faSquarePlus"></FontAwesomeIcon> Create a new task
        </b-row>
        <b-row 
          v-for="task in tasks" 
          @click="() => openEditTaskModal(task)"
          class="my-2 ">
          <b-col class="m-auto d-flex flex-column">
            <span>
              {{ formatDate(task.dueDate) }}
            </span>
            <span>
              Status: {{ task.status }}
            </span>
          </b-col>
          <b-col class="py-2 shadow m-md-4 px-4 d-flex flex-column col-8 col-md-10">
            <b-row>
              {{ task.title }}
            </b-row>
            <b-row style="font-size: .9rem; color: #aaabbb;">
              {{ task.description }}
            </b-row>
            <b-row class="pt-2">
              Assigned to
              <span v-for="(id, idx) in task.userIds">
                &nbsp;{{ id }}
                <span v-if="idx !== task.userIds.length - 1">,</span>
              </span>
            </b-row>
          </b-col>
        </b-row>
      </b-container>
    </b-container>
    <b-modal v-model="showCreateTaskModal" centered title="Create Task">
      <b-overlay :show="taskLoading">
        <b-form v-if="newTask">
          <b-form-group
            label="Title"
            label-cols="3"
            label-for="new-task-title-input">
            <b-form-input
              v-model="newTask.title"
              id="new-task-title-input">
            </b-form-input>
          </b-form-group>
          <b-form-group
            label="Description"
            label-cols="3"
            label-for="new-task-desc-input">
            <b-form-textarea
              id="new-task-desc-input"
              v-model="newTask.description">
            </b-form-textarea>
          </b-form-group>
          <b-form-group
            label="Due Date"
            label-cols="3"
            label-for="new-task-date-input">
            <b-form-datepicker
              id="new-task-date-input"
              v-model="newTask.dueDate">
            </b-form-datepicker>
          </b-form-group>
          <b-form-group
            label="Assign to"
            label-cols="3"
            label-for="new-task-users-input">
            <b-form-select multiple
              v-model="newTask.userIds"
              id="new-task-users-input"
              :options="userOptions">
            </b-form-select>
          </b-form-group>
        </b-form>
      </b-overlay>
      <template #modal-footer>
        <div>
          <b-button variant="outline-secondary" @click="closeCreateTaskModal">Cancel</b-button>
          <b-button class="ml-2" variant="primary" @click="handleCreateTask">Save</b-button>
        </div>
      </template>
    </b-modal>
    <b-modal v-model="showEditTaskModal" title="Task" centered>
      <b-overlay :show="taskLoading">
        <b-form v-if="updateTask && canEdit">
          <b-form-group
            label="Title"
            label-cols="3"
            label-for="update-task-title-input">
            <b-form-input
              id="update-task-title-input"
              v-model="updateTask.title">
            </b-form-input>
          </b-form-group>
          <b-form-group
            label="Description"
            label-cols="3"
            label-for="update-task-desc-input">
            <b-form-textarea
              id="update-task-desc-input"
              v-model="updateTask.description">
            </b-form-textarea>
          </b-form-group>
          <b-form-group
            label="Due Date"
            label-cols="3"
            label-for="update-task-date-input">
            <b-form-datepicker
              id="update-task-date-input"
              v-model="updateTask.dueDate">
            </b-form-datepicker>
          </b-form-group>
          <b-form-group
            label="Assign to"
            label-cols="3"
            label-for="update-task-users-input">
            <b-form-select multiple
              id="update-task-users-input"
              v-model="updateTask.userIds"
              :options="userOptions">
            </b-form-select>
          </b-form-group>
          <b-form-group
            label="Status"
            label-cols="3"
            label-for="update-task-status-input">
            <b-form-select
              id="update-task-status-input"
              v-model="updateTask.status"
              :options="taskStatusOptions">
            </b-form-select>
          </b-form-group>
        </b-form>
        <b-container v-else>
          <b-row style="font-size: 1.3rem;">Task: {{ updateTask.title }}</b-row>
          <b-row>Due {{ formatDate(updateTask.dueDate) }}</b-row>
          <b-row>created by {{ updateTask.creatorId  }}</b-row>
          <b-row>Status: {{ updateTask.status }}</b-row>
          <b-row class="pt-4" style="color: #888888;">{{ updateTask.description }}</b-row>
        </b-container>
      </b-overlay>
      <template #modal-footer v-if="canEdit">
        <div style="width: 100%;" class="d-flex flex-row justify-content-between">
          <b-button variant="danger" @click="handleDeleteCurrentTask">
            <FontAwesomeIcon :icon="faTrashCan"></FontAwesomeIcon>
          </b-button>
          <div style="gap: 1rem;" class="d-flex">
            <b-button variant="outline-secondary" @click="closeEditTaskModal">Cancel</b-button>
            <b-button variant="primary" @click="handleUpdateTask">Save changes</b-button>
          </div>
        </div>
      </template>
    </b-modal>
  </b-overlay>
</template>

<script setup lang="ts">
import { ref, Ref, onMounted, computed, inject } from 'vue'
import { IProject, ITask } from '../types/mongo.types'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faSquarePlus, faTrashCan } from '@fortawesome/free-solid-svg-icons'

interface SelectOption {
  value: string, text: string
}

interface Props {
  project: IProject
}

const taskStatusOptions = [
  { value: 'not-started', text: 'Not started' },
  { value: 'in-progress', text: 'In progress' },
  { value: 'complete', text: 'Complete' }
]

const props = defineProps<Props>()

const user: Ref<any> = inject('user')!
const loading = ref(false)
const taskLoading = ref(false)
const showCreateTaskModal = ref(false)
const showEditTaskModal = ref(false)

const canEdit = computed(() => {
  return props.project.creatorId === user.value.preferred_username
})

const newTask: Ref<any> = ref({
  title: '',
  description: '',
  dueDate: new Date(),
  userIds: [],
  projectId: props.project._id
})
const updateTask: Ref<any> = ref()

const userOptions: Ref<SelectOption[]> = computed(() => {
  let arr = []
  arr = props.project.memberIds.map((member: any) => { return { value: member, text: member }})
  arr.push({
    value: props.project.creatorId,
    text: props.project.creatorId
  })

  return arr
})

const openCreateTaskModal = () => { showCreateTaskModal.value = true }

const openEditTaskModal = (task: ITask) => {
  updateTask.value = {
    _id: task._id,
    title: task.title,
    status: task.status,
    description: task.description,
    dueDate: task.dueDate || new Date(),
    userIds: task.userIds.slice(),
    projectId: props.project._id,
    creatorId: task.creatorId
  }

  showEditTaskModal.value = true
}

const closeEditTaskModal = () => { showEditTaskModal.value = false }
const closeCreateTaskModal = () => { showCreateTaskModal.value = false }

const tasks: Ref<ITask[]> = ref([])

const handleCreateTask = async () => {
  console.log(newTask.value)
  try {
    taskLoading.value = true

    await fetch('/api/tasks/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newTask.value)
    })

    newTask.value = {
      title: '',
      description: '',
      dueDate: new Date(),
      userIds: [],
      projectId: props.project._id
    }

    showCreateTaskModal.value = false
    refresh()
  } catch (error) {
    return
  } finally {
    taskLoading.value = false
  }
}

const handleUpdateTask = async () => {
  try {
    taskLoading.value = true

    await fetch(`/api/tasks/${updateTask.value._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateTask.value)
    })

    taskLoading.value = false

  } catch (error) {
  }

  showEditTaskModal.value = false
  await refresh()

}

const handleDeleteCurrentTask = async () => {
  try {
    taskLoading.value = true

    await fetch(`/api/tasks/${updateTask.value._id}`, {
      method: 'DELETE'
    })

    taskLoading.value = false
  } catch (error) {
    
  }

  showEditTaskModal.value = false
  await refresh()
}

const refresh = async () => {
  try {
    loading.value = true
    const res = await fetch(`/api/projects/${props.project._id}/tasks`)

    if (res.ok) {
      tasks.value = await res.json()
    }

    loading.value = false
    
  } catch (error) {
    return
  }
}

const formatDate = (date: Date | string | null) => {
  if (date) {
    return new Date(date).toLocaleDateString()
  }
}

onMounted(() => {
  refresh()
})

</script>