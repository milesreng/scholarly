<template>
  <div class="container py-4">
    <h1>Log in</h1>
    <b-form @submit="handleLogin">
      <b-form-group
        id="input-login-username"
        label="Username"
        label-for="input-username">
        <b-form-input
          id="input-username"
          v-model="formData.username">

        </b-form-input>
      </b-form-group>
      <b-form-group
        id="input-login-password"
        label="Password"
        label-for="input-password">
        <b-form-input
          v-if="showPassword"
          id="input-password"
          type="text"
          v-model="formData.password">  
        </b-form-input>
        <b-form-input
          v-else
          id="input-password"
          type="password"
          v-model="formData.password">
        </b-form-input>
        <span @click="handleTogglePassword" style="font-size: .8rem; float: right; ">
          <span v-if="showPassword">hide</span>
          <span v-else>show</span>
        </span>
      </b-form-group>
      <b-button type="submit">
        Submit
      </b-button>
    </b-form>
    <a href='/api/auth/login'>Log in with gitlab</a>
    <!-- <div @click="handleGitlabLogin">Log in with google</div> -->
  </div>
</template>

<script setup lang="ts">
import { Ref, ref } from 'vue'
import { LoginFormData } from '../types/user.types'

const formData: Ref<LoginFormData> = ref({ username: '', password: '' })
const showPassword: Ref<boolean> = ref(true)

const handleLogin = async (e: any) => {
  e.preventDefault()
  // console.log(formData.value)
  if (formData.value.username && formData.value.password) {
    await fetch('')
  }
}

const handleTogglePassword = () => {
  showPassword.value = !showPassword.value
}

</script>