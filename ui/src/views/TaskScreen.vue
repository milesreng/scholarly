<template>
  <b-overlay :show="loading" style="min-height: 100vh;">
    <div class="sub-navbar" style="margin: 0; width: 100%;">
      <ProjectNavbar :project="selectedProject"></ProjectNavbar>
    </div>
    <b-container v-if="selectedProject" class="shadow my-4 p-4">
      <span style="font-size: 1.5rem;">Task List</span>
      <div v-if="projectTasks">
        <span v-for="task in projectTasks">
          {{ task.title }}
        </span>
      </div>
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
import { IProject } from '../../../server/models/project.model'
import { ITask } from '../../../server/models/task.model'
import ProjectNavbar from '../components/ProjectNavbar.vue'

interface Props {
  projectId: string
}

const props = withDefaults(defineProps<Props>(), { projectId: ''})

const userProjects: Ref<IProject[]> = inject('userProjects')!
const projectTasks: Ref<ITask[]> = ref([])
const loading = ref(false)

const selectedProject = computed(() => {
  if (props.projectId) return userProjects.value.find((project) => project._id === props.projectId) || null
  return null
})

onMounted(async () => {
  const res = await fetch(`/api/projects/${props.projectId}/tasks`)

  if (!res.ok) return
  projectTasks.value = await res.json() 
})

</script>