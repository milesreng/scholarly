<template>
  <div class="d-flex flex-row py-2 px-3 justify-content-between sub-navbar" style="width: 100%;">
    <div>
      <b-dropdown variant="outline-secondary" size="sm" split>
        <template #button-content v-if="props.project">
          <a :href="'/projects/' + props.project._id" style="text-decoration: none; color: black;">
            {{ props.project.title }}
          </a>
        </template>   
        <template #button-content v-else>
          <span>
            Select a project
          </span>
        </template>
        <b-dropdown-item href="/projects">
          All Projects
        </b-dropdown-item>
        <b-dropdown-divider></b-dropdown-divider>
        <b-dropdown-item v-for="project in userProjects" :href="'/projects/' + project._id">
            {{ project.title }}
        </b-dropdown-item>  
        <b-dropdown-divider></b-dropdown-divider>
        <b-dropdown-item @click="() => openModal()">
          <FontAwesomeIcon :icon="faSquarePlus"></FontAwesomeIcon>
          Create new project
        </b-dropdown-item>
      </b-dropdown>
    </div>
    <!-- <div class="d-flex flex-row align-items-center" style="gap: 2rem;" v-if="props.project">
      <FontAwesomeIcon :icon="faTrashCan"></FontAwesomeIcon>
    </div> -->
    <b-modal v-model="showModal" title="Create New Project" centered>
      <b-container v-if="createdProject">
        Your project has been successfully created.
      </b-container>
      <b-form v-else>
        <b-form-group
          id="project-title-group"
          label="Title"
          label-for="project-title-input"
          label-cols="3">
          <b-form-input
            id="project-title-input"
            :state="validTitleInput"
            v-model="newProject.title"
            @change="checkFormValidate"
            required></b-form-input>
            <b-form-invalid-feedback id="project-title-feedback">
              Title must be at least 3 letters
            </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group
          id="project-title-group"
          label="Description"
          label-for="project-title-input"
          label-cols="3">
          <b-form-textarea
            id="project-title-input"
            v-model="newProject.description"
            required></b-form-textarea>
        </b-form-group>
        <b-form-group
          id="project-users-group"
          label="Members"
          label-for="project-users-input"
          label-cols="3">
          <b-form-tags
            id="project-users-input"
            v-model="newProject.memberIds">
          </b-form-tags>
        </b-form-group>
      </b-form>
      <template #modal-footer v-if="createdProject">
        <b-button variant="primary" :href="'/projects/' + createdProject._id">Go to project</b-button>
      </template>
      <template #modal-footer v-else>
        <b-button @click="closeModal">Cancel</b-button>
        <b-button variant="primary" @click="handleCreateProject">Create project</b-button>
      </template>
    </b-modal>
  </div>
</template>

<script setup lang="ts">
import { Ref, ref, inject, onMounted } from 'vue'
import { IProject } from '../../../server/models/project.model'
import { IUser } from '../../../server/models/user.model'
import { DropdownOption } from '../types/options.types'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faSquarePlus } from '@fortawesome/free-regular-svg-icons'

interface Props {
  project: IProject | null
}

const props = defineProps<Props>()

// const user: Ref<any> = inject('user')!
// const siteAdmin: Ref<boolean> = inject('admin')!
const userProjects: Ref<IProject[]> = inject('userProjects')!
const newProject: Ref<any> = ref({
  title: '',
  description: '',
  memberIds: [],
})

const validTitleInput: Ref<boolean | null> = ref(null)
const publicUserOptions: Ref<DropdownOption[]> = ref([])

const modalLoading = ref(false)
const showModal = ref(false)
const createdProject: Ref<IProject | null> = ref(null)

// const projectAdmin = computed(() => {
//   if (props.project) return props.project.creatorId === user.value.preferred_username
//   return false
// })

const openModal = () => { showModal.value = true }
// const closeModal = () => { showModal.value = false }

const checkFormValidate = () => {
  var isValidated = true

  if (newProject.value.title.length < 3) {
    validTitleInput.value = false
    isValidated = false
  } else {
    validTitleInput.value = true
  }

  return isValidated
}

const handleCreateProject = async () => {
  modalLoading.value = true

  const res = await fetch('/api/projects', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(newProject.value)
  })

  modalLoading.value = false
  
  if (res.ok) {
    createdProject.value = await res.json()
  }
}

</script>