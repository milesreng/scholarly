<template>
  <div class="app">
    <b-navbar toggleable="lg">
      <div class="d-flex justify-content-between" style="width: 100%">
        <b-navbar-brand class="light-text">
          <router-link :to="{ name: 'dashboard' }" class="navbar-link">
            Scholarly
          </router-link>
        </b-navbar-brand>
        <div v-if="user">
          Hi, {{ user.name }}
        </div>
        <div v-else class="d-flex" style="gap: 2rem;">  
          <router-link :to="{ name: 'login' }" class="navbar-link">
            Log in
          </router-link>
          <router-link :to="{ name: 'register' }" class="navbar-link-opaque">
            Sign up
          </router-link>
        </div>
      </div>
    </b-navbar>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { Ref, ref } from 'vue'
import { IUser } from '../../server/models/user.model'

const user: Ref<IUser | null> = ref(null)


</script>

