<template>
  <div class="app">
    <b-navbar toggleable="lg">
      <div class="d-flex justify-content-between" style="width: 100%; color: white; text-decoration: none; ">
        <b-navbar-brand class="light-text">
          <router-link :to="{ name: 'dashboard' }" class="navbar-link">
            Scholarly
          </router-link>
        </b-navbar-brand>
        <div v-if="user?.preferred_username" class="d-flex flex-row" style="margin: auto 0;">
          <span>
            Hi, {{ user.preferred_username }}
          </span>
          <form method='POST' action='/api/auth/logout'>Logout</form>
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
import { ref, provide, onMounted } from 'vue'

const user = ref({} as any)

provide('user', user)
onMounted(async () => { 
  const res = await fetch('/api/users/profile')
  if (!res.ok) { console.log('user not found'); return; }

  user.value = await res.json()
  console.log('User:', user.value)
})


</script>

