<template>
  <b-overlay :show="userLoading || loading" style="min-height: 100vh; ">
    <div class="sub-navbar" style="margin: 0; width: 100%;">
      <ProjectNavbar :project="selectedProject"></ProjectNavbar>
    </div>
    {{ user }}
    <b-container class="container py-4">
      <b-row style="align-items: end">
        <span style="font-size: 2rem;">{{ date }}</span>
        <span style="font-size: 1.5rem; padding-bottom: .2rem; padding-left: .8rem; ">{{ time }}</span>
      </b-row>
      <b-row v-if="userTasks" style="justify-content: space-between; margin: 1rem 0; ">
        <b-col class="dashboard-container shadow-sm" cols="4" style="padding: .5rem 1rem;">
          <span style="font-size: 1.5rem;">Task List</span>
          <div>
            <div v-for="(task, idx) in userTasks">
              <span @click="() => openModal(idx)">{{ task.title }}</span>
            </div>
          </div>
        </b-col>
        <b-col class="dashboard-container shadow-sm" cols="7" style="padding: .5rem 1rem;">
          <span style="font-size: 1.5rem;">Chats</span>
        </b-col>
        <div v-if="userTasks.length > 0">
          <b-modal v-model="showModal" centered v-bind:title="'Task: ' + userTasks[modalTaskIdx].title" content-class="font-roboto">
            <!-- <span>Last updated: {{ userTasks[modalTaskIdx],updatedAt }}</span> -->
            <b-form v-if="userTasks[modalTaskIdx].creatorId !== user.preferred_username">
              <b-form-group
                id='due-date-group'
                label="Due Date"
                label-for="due-date-input"
                label-cols="4">
                <b-form-datepicker
                  id="due-date-input"
                  v-model="userTasks[modalTaskIdx].dueDate"
                  required></b-form-datepicker>
              </b-form-group>
              <b-form-group
                id="status-group"
                label="Status"
                label-for="status-input"
                label-cols="4">
                <b-form-select
                  id="status-input"
                  v-model="userTasks[modalTaskIdx].status"
                  :options="statusChoices"></b-form-select>
              </b-form-group>
              <!-- TODO: implement assign to user based on group -->
              <!-- options should map to the list of possible users -->
              <!-- <b-form-group
                id="user-ids-group"
                label="Assign to:"
                label-for="user-ids-input">
                <b-form-select 
                  id="user-ids-input"
                  v-model="userTasks[modalTaskIdx].userIds" 
                  :options=""></b-form-select>
              </b-form-group> -->
              <b-form-group
                id="description-group"
                label="Description"
                label-for="description-input"
                label-cols="4">
                <b-form-textarea
                  id="description-input"
                  v-model="userTasks[modalTaskIdx].description"></b-form-textarea>
              </b-form-group>
            </b-form>
            <b-container v-else>
              <b-row>
                {{ userTasks[modalTaskIdx] }}

              </b-row>
              Not thecreator
            </b-container>
            <template #modal-ok v-if="userTasks[modalTaskIdx].creatorId !== user.preferred_username">
              <span>Save changes</span>
            </template> 
            <template #modal-ok v-else>
              <span>OK</span>
            </template> 
          </b-modal>
          </div>
      </b-row>
      <b-row v-else-if="userLoading">
      </b-row>
      <b-row v-else>
        You must be logged in to view this page.
      </b-row>
    </b-container>
  </b-overlay>
</template>

<script setup lang="ts">
import { Ref, ref, watch, inject, onMounted, computed } from 'vue'
import ProjectNavbar from '../components/ProjectNavbar.vue'
import { ITask } from '../../../server/models/task.model'
import { IProject } from '../../../server/models/project.model'

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const statusChoices = [
  { value: 'not-started', text: 'Not started' },
  { value: 'in-progress', text: 'In progress' },
  { value: 'complete', text: 'Complete' }
]

interface Props {
  projectId: string
}

const props = withDefaults(defineProps<Props>(), {
  projectId: ''
})

const user: Ref<any> = inject('user')!
const userLoading: Ref<boolean> = inject('userLoading')!
const userProjects: Ref<IProject[]> = inject('userProjects')!
const userFoundStatus: Ref<string> = inject('userFoundStatus')!
const userTasks: Ref<ITask[]> = ref([])
const selectedProject = computed(() => {
  if (props.projectId) {
    return userProjects.value.find((project) => project._id === props.projectId) || null
  }
  return null
})
const loading = ref(true)
const date: Ref<string> = ref('')
const time: Ref<string> = ref(new Date().toLocaleString().split(',')[1])
const modalTaskIdx: Ref<number> = ref(0)
const showModal: Ref<boolean> = ref(false)

const refreshTime = () => {
  const currDate = new Date()

  date.value = `${days[currDate.getDay()]} ${months[currDate.getMonth()]} ${currDate.getDate()}`
  time.value = new Date().toLocaleString().split(',')[1]

  // date.value = currDate.getDay() + ' ' + currDate.getMonth() + ' ' + currDate.getDay()
}

const openModal = (idx: number) => {
  modalTaskIdx.value = idx
  showModal.value = true
}

const closeModal = () => { showModal.value = false; }

const getUserTasks = async () => {
  loading.value = true
  userTasks.value = await (await fetch('/api/tasks/')).json()
  loading.value = false
}

const handleUpdateTask = async () => {
  if (userTasks.value[modalTaskIdx.value].creatorId !== user.value.preferred_username) {
    return
  }


}

setInterval(refreshTime, 1000)

onMounted(async () => {
  refreshTime()
  getUserTasks()
})

</script>