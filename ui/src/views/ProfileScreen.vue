<template>
  <b-container v-if="user && userForm">
    <b-row style="gap: 2rem;">
      <b-col 
        class="sub-navbar my-4 p-4"  
        style="background-color: #eeeeee;"
        cols="4">
        <div class="d-flex flex-column justify-content-center align-items-center">
          <img :src="user.picture" alt="" class="rounded-circle mb-4" style="width: 30%;">
          <span style="font-size: 1.3rem;">{{ user.name }}</span>
          <span style="font-size: 1rem;">{{ user.email }}</span>
        </div>
      </b-col>
      <b-col 
        class="sub-navbar my-4 p-4" 
        style="background-color: #eeeeee;"
        cols="7">
        <b-form>
          <b-form-group
            label="Display Name"
            label-for="display-name-input"
            label-cols="4">
            <b-form-input
              id="display-name-input"
              v-model="userForm.display_name">
            </b-form-input>
          </b-form-group>
          <b-form-group
            label="Privacy"
            label-cols="4"
            description="When your profile is public, your picture, email, and display name will be visible to all users.">
                <b-form-radio-group
                  v-model="userForm.public_view"
                  :options="['Public', 'Private']"
                  style="margin-top: .4rem;">
                </b-form-radio-group>
          </b-form-group>
        </b-form>
      </b-col>
    </b-row>
    <b-row>
      <span style="font-size: 1.5rem; font-weight: bold;">
        Manage My Projects
      </span>
    </b-row>
  </b-container>
</template>

<script setup lang="ts">
import { Ref, ref, inject, watch } from 'vue'

const user: Ref<any> = inject('user')!
const mongoUser: Ref<any> = inject('mongoUser')!
const userForm = ref({} as any)

watch(user, () => {
  userForm.value = { ...(user.value), ...(mongoUser.value) }
})

</script>