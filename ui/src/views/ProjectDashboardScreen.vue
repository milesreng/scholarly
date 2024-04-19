<template>
  <ProjectNavbar :project="selectedProject"></ProjectNavbar>
  <b-container v-if="userProjects" style="padding: 1rem 0;">
    <!-- <b-row>
      <Clock></Clock>
    </b-row> -->
    <b-row v-if="selectedProject" class="px-2 d-flex flex-column">
      <!-- <a href="/projects" style="margin-top: -.5rem;">&larr; back to all projects</a> -->
      {{ selectedProject }}
      <ProjectView :project="selectedProject" @deleteProject="refresh" @refresh="refresh"></ProjectView> 
    </b-row>
    <b-row v-else-if="loading">

    </b-row>
    <b-row v-else class="d-flex flex-column px-4" style="gap: 1rem; ">
      <b-row v-if="siteAdmin">
        <b-button v-if="showAdminView" @click="() => setShowAdminView(false)">
          Show user view
        </b-button>
        <b-button v-else @click="() => setShowAdminView(true)">
          Show admin view
        </b-button>
        <!-- <VueToggle title="Admin View" name="Admin View" @toggle="setShowAdminView"></VueToggle> -->
      </b-row>
      <b-row v-else>
        User Projects
      </b-row>
      <b-row v-if="siteAdmin && adminProjects && showAdminView" class="d-flex flex-column" style="gap: 2rem">
        <ProjectCard v-for="project in adminProjects" :project="project"></ProjectCard>
      </b-row>
      <b-row v-else class="d-flex flex-column" style="gap: 2rem">
        <ProjectCard v-for="project in userProjects" :project="project"></ProjectCard>
      </b-row>
    </b-row>
  </b-container>
  <div v-else>
    No projects found.
  </div>
</template>

<script setup lang="ts">
import { Ref, ref, provide, inject, computed, onMounted } from 'vue'
import { IProject } from '../../../server/models/project.model'
// import VueToggle from 'vue-toggle-component'

import ProjectNavbar from '../components/ProjectNavbar.vue'
import ProjectCard from '../components/ProjectCard.vue'
import ProjectView from '../components/ProjectView.vue'
import { DropdownOption } from '../types/options.types'

interface Props {
  projectId: string
}

const props = defineProps<Props>()

const siteAdmin: Ref<boolean> = inject('admin')!
const loading: Ref<boolean> = inject('loading')!

const projectOptions: Ref<DropdownOption[]> = ref([])
const userProjects: Ref<IProject[]> = ref([])
const adminProjects: Ref<IProject[]> = ref([])
const selectedProject: Ref<IProject | null> = ref(null)
const showAdminView = ref(false)

provide('userProjects', userProjects)
provide('projectOptions', projectOptions)
provide('selectedProject', selectedProject)

const setShowAdminView = (bool: boolean) => {
  showAdminView.value = bool
}

// const formatDate = (date: string | null) => {
//   if (date) {
//     return new Date(date).toLocaleDateString()
//   }
//   return '-'
// }

// const formatTime = (date: string | null) => {
//   if (date) {
//     return new Date(date).toLocaleTimeString()
//   }
//   return '-'
// }


const refresh = async () => {
  const projects = await fetch('/api/user/projects')
  if (!projects.ok) { console.log('no projects found'); return; }

  userProjects.value = await projects.json()
  console.log(userProjects.value)
  projectOptions.value = userProjects.value.map((project: IProject) => {
    return { value: project._id, text: project.title }
  })

  if (siteAdmin) {
    const res = await fetch('/api/projects/')

    if (res.ok) {
      adminProjects.value = await res.json()
    }
  }

  if (props.projectId && !adminProjects) {
    selectedProject.value = userProjects.value.find((project) => project._id === props.projectId) || null
  } else if (props.projectId) {
    selectedProject.value = adminProjects.value.find((project) => project._id === props.projectId) || null
  }
}

onMounted(async () => {
  refresh()
})

</script>