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
    <b-row v-else>
      <div v-if="siteAdmin">
        <span v-if="showAdminView" @click="() => setShowAdminView(false)">
          Show all
        </span>
        <span v-else @click="() => setShowAdminView(true)">
          Show admin
        </span>
      </div>
      <div v-else>
        User Projects
      </div>
      <div>
        <div v-if="siteAdmin && adminProjects && showAdminView">
          {{ adminProjects }}
        </div>
        <div v-else>
          {{  userProjects }}
        </div>
      </div>
    </b-row>
  </b-container>
  <div v-else>
    No projects found.
  </div>
</template>

<script setup lang="ts">
import { Ref, ref, inject, computed, onMounted } from 'vue'
import { IProject } from '../../../server/models/project.model'

import ProjectNavbar from '../components/ProjectNavbar.vue'
import Clock from '../components/Clock.vue'

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