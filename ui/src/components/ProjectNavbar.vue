<template>
  <div class="d-flex flex-row py-2 px-3 justify-content-between" style="width: 100%; ">
    <div>
      <b-dropdown variant="outline-secondary" size="sm" split>
        <template #button-content v-if="props.project">
          <a :href="'/dashboard/' + props.project._id" style="text-decoration: none; color: black;">
            {{ props.project.title }}
          </a>
        </template>   
        <template #button-content v-else>
          <span>
            All Projects
          </span>
        </template>
        <b-dropdown-item href="/dashboard">
          All Projects
        </b-dropdown-item>
        <b-dropdown-divider></b-dropdown-divider>
        <b-dropdown-item v-for="project in userProjects" :href="'/dashboard/' + project._id">
            {{ project.title }}
        </b-dropdown-item>  
        <b-dropdown-divider></b-dropdown-divider>
        <b-dropdown-item @click="() => openModal()">
          <FontAwesomeIcon :icon="faSquarePlus"></FontAwesomeIcon>
          Create new project
        </b-dropdown-item>
      </b-dropdown>
    </div>
    <div class="d-flex flex-row align-items-center" style="gap: 2rem;" v-if="props.project">
      <a :href="'/dashboard/' + props.project._id + '/tasks'">Tasks</a>
      <span>Chat</span>
      <span v-if="admin">Group Settings</span>
    </div>
    <b-modal v-model="showModal" title="Create New Project" centered content-class="font-roboto">
      <b-form>
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
          id="project-admin-group"
          label="Admin"
          label-for="project-admin-input"
          label-cols="3">
          <b-form-select multiple
            :select-size="2"
            id="project-admin-input"
            v-model="newProject.adminIds"
            :options="publicUserOptions">
          </b-form-select>
        </b-form-group>
        <b-form-group
          id="project-users-group"
          label="Members"
          label-for="project-users-input"
          label-cols="3">
          <b-form-select multiple
            id="project-users-input"
            v-model="newProject.memberIds"
            :options="publicUserOptions">
          </b-form-select>
        </b-form-group>
      </b-form>
      <template #modal-footer>
        <b-button @click="closeModal">Cancel</b-button>
        <b-button variant="primary" @click="handleCreateProject">Create project</b-button>
      </template>
    </b-modal>
  </div>
</template>

<script setup lang="ts">
import { Ref, ref, computed, inject, onMounted } from 'vue'
import { IProject } from '../../../server/models/project.model'
import { IUser } from '../../../server/models/user.model'
import { DropdownOption } from '../types/options.types'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faSquarePlus } from '@fortawesome/free-regular-svg-icons'

interface Props {
  project: IProject | null
}

const props = defineProps<Props>()

const user: Ref<any> = inject('user')!
const userProjects: Ref<IProject[]> = inject('userProjects')!
const newProject: Ref<any> = ref({
  title: '',
  description: '',
  memberIds: [],
  adminIds: []
})

const validTitleInput: Ref<boolean | null> = ref(null)
const publicUserOptions: Ref<DropdownOption[]> = ref([])

const modalLoading = ref(false)
const showModal = ref(false)

const admin = computed(() => {
  if (props.project) return props.project.adminIds.includes(user.value.preferred_username)
  return false
})

const openModal = () => { showModal.value = true }
const closeModal = () => { showModal.value = false }

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
  if (!checkFormValidate()) return

  modalLoading.value = true

  await fetch('/api/projects', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST'
  })

  modalLoading.value = false
  showModal.value = false
}

onMounted(async () => {
  const res = await fetch('/api/user/all')

  console.log(res)

  if (res) publicUserOptions.value = (await res.json()).map((user: IUser) => {
    return { value: user.oidc_username, text: user.oidc_username }
  })
})

</script>