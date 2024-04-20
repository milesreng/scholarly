<template>
  <b-overlay :show="loading">
    <b-container>
      <b-row class="py-4" style="font-size: 2rem;">
        Hi, {{ user.name }}
      </b-row>
      <b-container>
        <b-row class="" style="font-size: 1.4rem;">
          Your Projects
        </b-row>
        <b-row v-if="userProjects" class="d-flex flex-column" style="gap: 1rem;">
          <div v-if="admin" class="my-2">
            <b-button v-if="adminView" @click="() => toggleAdminView(false)" variant="outline-info">
              Show user view
            </b-button>
            <b-button v-else @click="() => toggleAdminView(true)" variant="outline-secondary">
              Show admin view
            </b-button>
          </div>
          <div v-if="admin && adminView" class="d-flex flex-column" style="gap: 1rem;">
            <Project v-for="project in adminProjects" :project="project"></Project>
          </div>
          <div v-else class="d-flex flex-column" style="gap: 1rem;">
            <Project v-for="project in userProjects" :project="project"></Project>
          </div>
        </b-row>
      </b-container>
    </b-container>
  </b-overlay>
</template>

<script setup lang="ts">
import { ref, Ref, inject, onMounted } from 'vue'

import Project from '../components/Project.vue'

const loading = ref(false)

const user: Ref<any> = inject('user')!
const admin = inject('admin')!

const adminView = ref(false)
const adminProjects: Ref<any> = ref()
const userProjects: Ref<any> = ref()

const toggleAdminView = (val: boolean) => { adminView.value = val }

const refresh = async () => {
  if (admin) {
    const res = await fetch('/api/projects/')

    if (res.ok) {
      adminProjects.value = await res.json()
    }
  }

  const res = await fetch('/api/user/projects')

  if (res.ok) {
    userProjects.value = await res.json()
  }
}

onMounted(() => {
  refresh()
})

</script>