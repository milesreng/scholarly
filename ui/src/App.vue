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
              <!-- <img :src="user.picture" alt="" class="rounded-circle" style="width: 30%;"> -->
              {{  user.preferred_username }}
            </template>
            <b-dropdown-item style="text-align: right;" href="/profile">
              {{ user.name }}
              <br/> 
              <span style="font-size: .9rem;">@{{ user.preferred_username }}</span>
            </b-dropdown-item>
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item style="text-align: right;" href="/projects">
                Projects
            </b-dropdown-item>
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
    <b-overlay :show="loading" style="min-height: 100vh; padding: 0; margin: 0;">
      <router-view />
    </b-overlay>
  </div>
</template>

<script setup lang="ts">
import { ref, provide, onMounted } from 'vue'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faBookOpenReader } from '@fortawesome/free-solid-svg-icons'

const user = ref({} as any)
const mongoUser = ref({} as any)
const admin = ref(false)

const loading = ref(false)

provide('user', user)
provide('admin', admin)
provide('mongoUser', mongoUser)
provide('loading', loading)

onMounted(async () => { 
  loading.value = true

  const res = await fetch('/api/user/profile')
  if (!res.ok) { console.log('user not found'); loading.value = false; return; }

  user.value = await res.json()
  // mongoUser.value = user.value._doc
  console.log(user.value)

  // if (user.value.groups.includes('scholarly-admin')) {
  //   admin.value = true
  // }

  loading.value = false
})

const handleLogout = async () => {
  const res = await fetch('/api/auth/logout', {
    method: 'POST'
  })

  if (res.ok) {
    user.value = {}
    mongoUser.value = {}
  }
}

</script>

