<template>
  <b-overlay :show="userLoading || loading" style="min-height: 100vh; ">
    <div class="sub-navbar" style="margin: 0; width: 100%;">
      <ProjectNavbar :project="selectedProject"></ProjectNavbar>
    </div>
    <b-container class="container py-4">
      <b-row style="align-items: end">
        <Clock></Clock>
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
                  :options="taskStatusChoices"></b-form-select>
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
import { Ref, ref, inject, onMounted, computed } from 'vue'
import ProjectNavbar from '../components/ProjectNavbar.vue'
import Clock from '../components/Clock.vue'

import { ITask, taskStatusChoices } from '../../../server/models/task.model'
import { IProject } from '../../../server/models/project.model'

interface Props {
  projectId: string
}

const props = withDefaults(defineProps<Props>(), {
  projectId: ''
})

const user: Ref<any> = inject('user')!
const userLoading: Ref<boolean> = inject('userLoading')!
const userProjects: Ref<IProject[]> = inject('userProjects')!

const userTasks: Ref<ITask[]> = ref([])
const selectedProject = computed(() => {
  if (props.projectId) {
    return userProjects.value.find((project) => project._id === props.projectId) || null
  }
  return null
})
const loading = ref(true)
const modalTaskIdx: Ref<number> = ref(0)
const showModal: Ref<boolean> = ref(false)

const openModal = (idx: number) => {
  modalTaskIdx.value = idx
  showModal.value = true
}

const getUserTasks = async () => {
  loading.value = true
  userTasks.value = await (await fetch('/api/tasks/')).json()
  loading.value = false
}

onMounted(async () => {
  getUserTasks()
})

</script>