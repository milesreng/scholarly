<template>
  <b-overlay :show="loading" style="min-height: 100vh;">
    <b-container class="p-4" v-if="user.preferred_username">
      <b-container>
        <b-row class="d-flex flex-column">
          <div>
            <!-- {{ user}} -->
            Viewing tasks for 
            <span v-if="selectedProject">
              {{ selectedProject.title }}
            </span>
            <span v-else>
              user {{ user.preferred_username }}
            </span>
          </div>
          <div @click="openCreateTaskModal" style="padding: .2rem 0;" v-if="selectedProject">
            <FontAwesomeIcon :icon="faSquarePlus"></FontAwesomeIcon> Add new task
          </div>
          <div v-if="projectTasks" class="d-flex flex-column" style="gap: .5rem; width: 100%;">
            <ResponsiveTask
              v-for="(task, idx) in projectTasks" 
              style="width: 100%;" 
              @click="() => openViewTaskModal(idx)" 
              :task="task"></ResponsiveTask>
          <b-modal v-model="showViewTaskModal" centered size="lg" title="View Task">
            <b-container v-if="modalTask">
              <Task :task="modalTask"></Task>
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
              :options="projectUserOptions">
            </b-form-select>
          </b-form-group>
        </b-form>
          <template #modal-footer>
            <b-button @click="closeCreateTaskModal">Cancel</b-button>
            <b-button variant="primary" @click="handleCreateTask">Create task</b-button>
          </template>
      </b-modal>
    </b-container>
    <b-container v-else>
      To view this page, please <a href='/api/auth/login'>log in</a> with gitlab.
    </b-container>
  </b-overlay>
</template>

<script setup lang="ts">
import { Ref, ref, computed, inject, onMounted } from 'vue'
import Task from '../components/Task.vue'
import ResponsiveTask from '../components/ResponsiveTask.vue'

import { IProject } from '../../../server/models/project.model'
import { ITask } from '../../../server/models/task.model'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faSquarePlus } from '@fortawesome/free-regular-svg-icons'

interface Props {
  projectId: string
}

const props = withDefaults(defineProps<Props>(), { projectId: ''})

// interface DropdownOption {
//   value: string,
//   text: string
// }

const user: Ref<any> = inject('user')!
const userProjects: Ref<IProject[]> = inject('userProjects')!

const projectTasks: Ref<ITask[]> = ref([])
// const userOptions: Ref<DropdownOption[]> = ref([])

const modalTask: Ref<ITask | null> = ref(null)
const createTask: Ref<any> = ref({
  title: '', description: '', userIds: [], projectId: '', status: 'not-started', dueDate: new Date()
})

const loading = ref(false)
const showViewTaskModal = ref(false)
const showCreateTaskModal = ref(false)

const selectedProject = computed(() => {
  if (props.projectId) return userProjects.value.find((project) => project._id === props.projectId) || null
  return null
})

const projectUserOptions = computed(() => {
  if (selectedProject.value) {
    return [...(selectedProject.value.memberIds), selectedProject.value.creatorId]
  }
})

const openViewTaskModal = (idx: number) => {
  if (idx < projectTasks.value.length) {
    modalTask.value = projectTasks.value[idx]
  }

  showViewTaskModal.value = true
}

const openCreateTaskModal = () => { showCreateTaskModal.value = true }
const closeCreateTaskModal = () => { showCreateTaskModal.value = false }

const handleCreateTask = async () => {
  if (!selectedProject.value) return

  createTask.value.projectId = selectedProject.value._id

  await fetch('/api/tasks/', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(createTask.value)
  })
  console.log(createTask.value)

  closeCreateTaskModal()
  refresh()
}

const refresh =  async () => {
  let tasks;
  if (props.projectId) {
    tasks = await fetch(`/api/projects/${props.projectId}/tasks`)
  } else {
    tasks = await fetch(`/api/tasks`)
  }

  if (!tasks.ok) return
  projectTasks.value = await tasks.json() 

  console.log(projectTasks)
}

onMounted(async () => {
  await refresh()

  if (projectTasks.value && projectTasks.value.length > 0) {
    modalTask.value = projectTasks.value[0]
  }
})

</script>