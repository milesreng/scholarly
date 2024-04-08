<template>
  <div class="container py-4">
    <h1>Register</h1>
    <b-form @submit="handleRegister">
      <span v-if="errorMessage">{{ errorMessage }}</span>
      <b-form-group
        id="input-login-fullname"
        label="Full Name"
        label-for="input-fullname">
        <b-form-input
          id="input-fullname"
          v-model="formData.name"
          required>

        </b-form-input>
      </b-form-group>
      <b-form-group
        id="input-login-username"
        label="Username"
        label-for="input-username">
        <b-form-input
          id="input-username"
          v-model="formData.username"
          required>

        </b-form-input>
      </b-form-group>
      <b-form-group
        id="input-login-email"
        label="Email"
        label-for="input-email">
        <b-form-input
          id="input-email"
          v-model="formData.email"
          required>
        </b-form-input>
      </b-form-group>
      <b-form-group
        id="input-register-password"
        label="Password"
        label-for="input-password">
        <b-form-input
          v-if="showPassword"
          id="input-password"
          type="text"
          v-model="formData.password"
          required>
        </b-form-input>
        <b-form-input
          v-else
          id="input-password"
          type="password"
          v-model="formData.password"
          required>
        </b-form-input>
        <span @click="handleTogglePassword" style="font-size: .8rem; float: right; ">
          <span v-if="showPassword">hide</span>
          <span v-else>show</span>
        </span>
      </b-form-group>
      <span v-if="!passwordMatch && formData.repeatPassword.length > 0">Passwords do not match</span>
      <b-form-group
        id="input-register-repeat-password"
        label="Repeat Password"
        label-for="input-repeat-password">
        <b-form-input
          id="input-repeat-password"
          type="password"
          v-model="formData.repeatPassword"
          required>
        </b-form-input>
      </b-form-group>
      <b-button type="submit">
        Submit
      </b-button>
    </b-form>
  </div>
</template>

<script setup lang="ts">
import { Ref, ref, watch } from 'vue'
import { RegisterFormData } from '../types/user.types'
import { isEmail, isStrongPassword } from 'validator'

const formData: Ref<RegisterFormData> = ref({ name: '', username: '', email: '', password: '', repeatPassword: '' })
const showPassword: Ref<boolean> = ref(false)
const errorMessage: Ref<string> = ref('')
const passwordMatch: Ref<boolean> = ref(false)

watch(formData, () => {
  if (formData.value.password === formData.value.repeatPassword) {
    passwordMatch.value = true
  } else {
    passwordMatch.value = false
  }
})

const handleRegister = async (e: any) => {
  e.preventDefault()
  console.log(formData.value)

  if (!isEmail(formData.value.email)) {
    errorMessage.value = 'Email is formatted incorrectly'
    return
  } else if (!isStrongPassword(formData.value.password)) {
  // { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1, returnScore: false, pointsPerUnique: 1, pointsPerRepeat: 0.5, pointsForContainingLower: 10, pointsForContainingUpper: 10, pointsForContainingNumber: 10, pointsForContainingSymbol: 10 }
    errorMessage.value = 'Password is not strong enough'
    return
  } else if (!passwordMatch.value) {
    errorMessage.value = 'Passwords do not match'
    return
  }

  errorMessage.value = ''
  
  // if (formData.value.username && formData.value.password) {
  //   await fetch('')
  // }
}

const handleTogglePassword = () => {
  showPassword.value = !showPassword.value
}

</script>