<template>
  <ProjectNavbar :project="selectedProject"></ProjectNavbar>
  <b-container v-if="userProjects">
    <b-row>
      <Clock></Clock>
    </b-row>
    <b-row v-if="selectedProject" class="px-2">
      <span style="font-size: 1.5rem;">
        Project: {{ selectedProject.title }}
      </span>
    </b-row>
    <b-row v-else class="d-flex flex-column px-4" style="gap: 1rem;">
      <b-row v-if="siteAdmin">
        <VueToggle title="Admin View" name="Admin View" @toggle="setShowAdminView"></VueToggle>
      </b-row>
      <b-row v-else>
        User Projects
      </b-row>
      <b-row v-if="siteAdmin && adminProjects && showAdminView" class="d-flex flex-column" style="gap: 2rem">
        <Project v-for="project in adminProjects" :project="project"></Project>
      </b-row>
      <b-row v-else class="d-flex flex-column" style="gap: 2rem">
        <Project v-for="project in userProjects" :project="project"></Project>
      </b-row>
    </b-row>
  </b-container>
  <div v-else>
    No projects found.
  </div>
</template>

<script setup lang="ts">
import { Ref, ref, inject, computed, onMounted } from 'vue'
import { IProject } from '../../../server/models/project.model'
import VueToggle from 'vue-toggle-component'

import ProjectNavbar from '../components/ProjectNavbar.vue'
import Clock from '../components/Clock.vue'
import Project from '../components/Project.vue'

interface Props {
  projectId: string
}

const props = defineProps<Props>()

const siteAdmin: Ref<boolean> = inject('admin')!
const userProjects: Ref<IProject[]> = inject('userProjects')!

const adminProjects: Ref<IProject[]> = ref([])
const showAdminView = ref(false)

const selectedProject = computed(() => {
  if (props.projectId) return userProjects.value.find((project) => project._id === props.projectId) || null
  return null
})

const setShowAdminView = (bool: boolean) => {
  showAdminView.value = bool
}

onMounted(async () => {
  if (siteAdmin) {
    const res = await fetch('/api/projects/')

    if (res.ok) {
      adminProjects.value = await res.json()
    }
  }
})

</script>