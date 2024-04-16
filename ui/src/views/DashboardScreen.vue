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
              <span @click="() => openViewTaskModal(idx)">{{ task.title }}</span>
            </div>
          </div>
        </b-col>
        <b-col class="dashboard-container shadow-sm" cols="7" style="padding: .5rem 1rem;">
          <span style="font-size: 1.5rem;">Chats</span>
        </b-col>
        <b-modal v-model="showViewTaskModal" centered size="lg" title="View Task">
            <b-container v-if="modalTask">
              <Task :task="modalTask"></Task>
            </b-container>
          </b-modal>
        <div v-if="userTasks.length > 0">
          
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
import Task from '../components/Task.vue'

import { ITask } from '../../../server/models/task.model'
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
const modalTask: Ref<ITask | null> = ref(null)
const showViewTaskModal = ref(false)

const openViewTaskModal = (idx: number) => {
  if (idx < userTasks.value.length) {
    modalTask.value = userTasks.value[idx]
  }

  showViewTaskModal.value = true
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