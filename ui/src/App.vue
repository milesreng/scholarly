<template>
  <div class="app bg-body-color">
    <b-navbar toggleable="lg">
      <div class="d-flex justify-content-between" style="width: 100%; color: white; text-decoration: none; ">
        <b-navbar-brand class="light-text">
          <router-link :to="{ name: 'dashboard' }" class="navbar-link">
            <!-- <span>
              <Icon name="clipboard-list-solid" />
            </span> -->
            <span style="font-size: 1.7rem;">
              <FontAwesomeIcon :icon="faBookOpenReader" />
              Scholarly
            </span>
          </router-link>
        </b-navbar-brand>
        <div v-if="user?.name" class="d-flex flex-row" style="margin: auto 0;">
          <b-dropdown right variant="outline-secondary">
            <template #button-content>
              <img :src="user.picture" alt="" class="rounded-circle" style="width: 30%;">
            </template>
            <b-dropdown-item style="text-align: right;" href="/profile">
              {{ user.name }}
              <br/> 
              <span style="font-size: .9rem;">@{{ user.preferred_username }}</span>
            </b-dropdown-item>
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item style="text-align: right;">Groups</b-dropdown-item>
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item style="text-align: right;" @click="handleLogout">
              Logout
            </b-dropdown-item>
          </b-dropdown>
        </div>
        <div v-else class="d-flex" style="gap: 2rem;">  
          <a style="margin: auto; font-size: 1.2rem; color: white;" 
            href='/api/auth/login'>Login</a>
          <!-- <router-link :to="{ name: 'login' }" class="navbar-link">
            Log in
          </router-link> -->
          <!-- <router-link :to="{ name: 'register' }" class="navbar-link-opaque">
            Sign up
          </router-link> -->
        </div>
      </div>
    </b-navbar>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { ref, provide, onMounted, Ref } from 'vue'
import { IProject } from '../../server/models/project.model'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faBookOpenReader } from '@fortawesome/free-solid-svg-icons'

interface DropdownOption {
  value: string,
  text: string
}

const user = ref({} as any)
const mongoUser = ref({} as any)
const userProjects: Ref<IProject[]> = ref([])

const projectOptions: Ref<DropdownOption[]> = ref([])
const userFoundStatus = ref('initial')
const loading = ref(false)

provide('user', user)
provide('mongoUser', mongoUser)
provide('userProjects', userProjects)
provide('userLoading', loading)
provide('userFoundStatus', userFoundStatus)

onMounted(async () => { 
  loading.value = true

  const res = await fetch('/api/user/profile')
  if (!res.ok) { console.log('user not found'); userFoundStatus.value = 'not-found'; loading.value = false; return; }

  userFoundStatus.value = 'found'

  user.value = await res.json()
  mongoUser.value = user.value._doc

  const projects = await fetch('/api/user/projects')
  if (!res.ok) { console.log('no projects found'); return; }

  userProjects.value = await projects.json()
  projectOptions.value = userProjects.value.map((project: IProject) => {
    return { value: project._id, text: project.title }
  })

  loading.value = false
  
  console.log('User:', user.value)
})

const handleLogout = async () => {
  const res = await fetch('/api/auth/logout', {
    method: 'POST'
  })

  if (res.ok) {
    user.value = {}
    userProjects.value = []
  }
}

</script>

