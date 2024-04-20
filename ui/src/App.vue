<template>
  <div class="app bg-body-color">
    <b-navbar toggleable="lg">
      <div class="d-flex justify-content-between" style="width: 100%; color: white; text-decoration: none; ">
        <b-navbar-brand class="light-text">
          <router-link :to="{ name: 'dashboard' }" class="navbar-link" style="color: black;">
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
            <b-dropdown-item style="text-align: right;">
              {{ user.name }}
              <br/> 
              <span style="font-size: .9rem;">@{{ user.preferred_username }}</span>
            </b-dropdown-item>
            <b-dropdown-divider></b-dropdown-divider>
            <!-- <b-dropdown-item style="text-align: right;" href="/projects">
                Projects
            </b-dropdown-item>
            <b-dropdown-divider></b-dropdown-divider> -->
            <b-dropdown-item style="text-align: right;" @click="handleLogout">
              Logout
            </b-dropdown-item>
          </b-dropdown>
        </div>
        <div v-else class="d-flex" style="gap: 2rem;">  
          <a style="margin: auto; color: black;" @click="openLoginModal">Login via DS</a>
          <a style="margin: auto; color: black;" 
            href='/api/auth/login'>Login via Gitlab</a>
          <!-- <router-link :to="{ name: 'login' }" class="navbar-link">
            Log in
          </router-link> -->
          <!-- <router-link :to="{ name: 'register' }" class="navbar-link-opaque">
            Sign up
          </router-link> -->
        </div>
      </div>
    </b-navbar>
    <b-modal v-model="showLoginModal" centered>
      <b-form>
        <b-form-group
          label-for="login-key-input"
          label="Login Key"
          label-cols="3">
          <b-form-input
            id="login-key-input"
            type="password"
            v-model="key">
          </b-form-input>
        </b-form-group>
        <b-form-group
          label-for="login-user-input"
          label="Username"
          label-cols="3">
          <b-form-input
            id="login-user-input"
            v-model="username">
          </b-form-input>
        </b-form-group>
        <b-form-group
          label-for="login-role-input"
          label="Role"
          label-cols="3">
          <b-form-input
            id="login-role-input"
            v-model="role">
          </b-form-input>
        </b-form-group>
      </b-form>
      <template #modal-footer>
        <div>
          <b-button variant="outline-secondary">Cancel</b-button>
          <b-button variant="info" class="ml-2" :href="'/api/auth/login?key=' + key + '&user=' + username + '&role=' + role">
            Log in
          </b-button>
        </div>
      </template>
    </b-modal>
    <b-overlay :show="loading" style="min-height: 100vh; padding: 0; margin: 0;">
      <router-view />
    </b-overlay>
  </div>
</template>

<script setup lang="ts">
import { ref, provide, onMounted } from 'vue'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faBookOpenReader } from '@fortawesome/free-solid-svg-icons'
import { router } from './main';

const user = ref({} as any)
const admin = ref(false)

const loading = ref(false)
const showLoginModal = ref(false)

const openLoginModal = () => { showLoginModal.value = true }
// const closeLoginModal = () => { showLoginModal.value = false }

provide('user', user)
provide('admin', admin)
provide('loading', loading)

const key = ref('')
const username = ref('')
const role = ref('')

onMounted(async () => { 
  loading.value = true

  const res = await fetch('/api/user/profile')
  if (!res.ok) { console.log('user not found'); loading.value = false; return; }

  user.value = await res.json()

  if (user.value && user.value.roles && user.value.roles.includes('admin')) {
    admin.value = true
  }

  loading.value = false
})

const handleLogout = async () => {
  const res = await fetch('/api/auth/logout', {
    method: 'POST'
  })

  if (res.ok) {
    user.value = {}

    router.push('/')
  }
}

</script>

