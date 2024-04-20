<template>
  <b-overlay :show="loading">
    <b-container v-if="user.name">
      <b-row class="py-4" style="font-size: 2rem;">
        Hi, {{ user.name }}
      </b-row>
      <b-container>
        <b-row class="" style="font-size: 1.4rem;">
          Your Projects
        </b-row>
        <div @click="openCreateProjectModal">
            <FontAwesomeIcon class="pr-2" :icon="faSquarePlus"></FontAwesomeIcon> Create a new project
        </div>
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
            <Project v-for="project in adminProjects"  :project="project"></Project>
          </div>
          <div v-else class="d-flex flex-column" style="gap: 1rem;">
            <div v-for="project in userProjects" class="d-flex flex-row justify-content-between">
              <b-col cols="11">
                <Project :project="project"></Project>
              </b-col>
              <b-button @click="() => handleDeleteProject(project._id)" variant="danger">
                <FontAwesomeIcon :icon="faTrashCan"></FontAwesomeIcon>
              </b-button>
            </div>
          </div>
        </b-row>
      </b-container>
    </b-container>
    <b-container v-else>
      You must log in to view this page.
    </b-container>
    <b-modal v-model="showCreateProjectModal" centered title="Create Project">
      <b-overlay :show="modalLoading">
        <b-form>
          <b-form-group
            label="Title"
            label-cols="3"
            label-for="new-project-title-input">
            <b-form-input
              id="new-project-title-input"
              v-model="newProject.title">
            </b-form-input>
          </b-form-group>
          <b-form-group
            label="Description"
            label-cols="3"
            label-for="new-project-desc-input">
            <b-form-textarea
              id="new-project-desc-input"
              v-model="newProject.description">

            </b-form-textarea>
          </b-form-group>
          <b-form-group
            label="Members"
            label-cols="3"
            label-for="new-project-members-input">
            <b-form-tags
              id="new-project-title-input"
              :value="projectUsers"
              @input="projectUsers = $event">
            </b-form-tags>
          </b-form-group>
        </b-form>

      </b-overlay>
      <template #modal-footer>
        <div>
          <b-button variant="outline-secondary" @click="closeCreateProjectModal">Cancel</b-button>
          <b-button variant="primary" @click="handleCreateProject">Create</b-button>
        </div>
      </template>
    </b-modal>
  </b-overlay>
</template>

<script setup lang="ts">
import { ref, Ref, inject, onMounted } from 'vue'

import Project from '../components/Project.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { faSquarePlus } from '@fortawesome/free-regular-svg-icons'

const loading = ref(false)
const modalLoading = ref(false)

const user: Ref<any> = inject('user')!
const admin = inject('admin')!

const adminView = ref(false)
const adminProjects: Ref<any> = ref()
const userProjects: Ref<any> = ref()

const newProject: Ref<any> = ref({
  title: '',
  description: '',
  memberIds: []
})

const projectUsers: Ref<string[]> = ref([])

const showCreateProjectModal = ref(false)

const openCreateProjectModal = () => { showCreateProjectModal.value = true }
const closeCreateProjectModal = () => { showCreateProjectModal.value = false }

const handleCreateProject = async () => {
  try {
    if (newProject.value && projectUsers.value) {

      modalLoading.value = true
      newProject.value.memberIds = projectUsers.value

      console.log(newProject.value)

      const res = await fetch('/api/projects/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newProject.value)
      })

      if (!res.ok) return

      modalLoading.value = false
      showCreateProjectModal.value = false

      newProject.value = {
        title: '',
        description: '',
        memberIds: []
      }

      refresh()
    }
    
  } catch (error) {
    
  }
}

const toggleAdminView = (val: boolean) => { adminView.value = val }

const handleDeleteProject = async (id: string) => {
  try {
    loading.value = true
    const res = await fetch(`/api/projects/${id}`, {
      method: 'DELETE'
    })

    loading.value = false
    if (!res.ok) return

    refresh()
  } catch (error) {
    
  }
}

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