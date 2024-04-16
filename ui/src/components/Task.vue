<template>
  <b-container>
    <b-row> 
      <b-col cols="12" style="padding: 0;">
        <div class="d-flex flex-row justify-content-between" style="width: 100%;">
          <div class="d-flex flex-row">
            <span style="font-size: 1.3rem;">
              <span style="font-weight: bold;">Task:</span>
              <span>&nbsp;{{ props.task.title }}</span>
            </span>
          </div>
          <div style="align-items: center;" class="py-1">
            <FontAwesomeIcon :icon="faPenToSquare" style="margin: auto;"></FontAwesomeIcon>
          </div>
        </div>
      </b-col>
    </b-row>
    <b-row>
      Created by&nbsp;<span style="text-decoration: underline;">{{ props.task.creatorId }}</span>
      <span v-if="props.task.createdAt">
        &nbsp;on {{ formatDate(props.task.createdAt) }} at {{ formatTime(props.task.createdAt) }}
      </span>
    </b-row>
    <b-row>
      Assigned to&nbsp;
      <span v-if="props.task.userIds.length <= 3">
        <span v-for="(userId, idx) in props.task.userIds">
          <!-- link to user profile -->
          <span v-if="userId === user.preferred_username">
            {{ userId }}
            <span v-if="idx !== props.task.userIds.length - 1">,&nbsp;</span>
          </span>
          <span v-else>
            <a :href="'/users/' + userId">{{ userId }}</a>
            <span v-if="idx !== props.task.userIds.length - 1">,&nbsp;</span>
          </span>
        </span>
      </span>
      <span v-else>
        <span v-for="(userId, idx) in props.task.userIds.slice(0,3)">
          <!-- link to user profile -->
          <a :href="'/users/' + userId">{{ userId }}</a>
          <span v-if="idx !== props.task.userIds.length - 1">,&nbsp;</span>
        </span>
        +
      </span>
    </b-row>
    <b-row>
      <b-form-select v-if="props.task.userIds.includes(user.preferred_username)"
        style="width: fit-content; margin: 1rem 0;"
        v-model="selectedStatus"
        :options="taskStatusChoices">
      </b-form-select>
    </b-row>
    <b-row>
      Description: {{ props.task.description }}
    </b-row>
  </b-container>
</template>

<script setup lang="ts">
import { ref, Ref, onMounted, inject } from 'vue'
import { ITask, taskStatusChoices } from '../../../server/models/task.model'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons'

interface Props {
  task: ITask
}

const props = defineProps<Props>()

const user: Ref<any> = inject('user')!
const selectedStatus = ref('')
const updateTask: Ref<ITask | null> = ref(null)

const formatDate = (date: string | null) => {
  if (date) {
    return new Date(date).toDateString()
  }
  return '-'
}

const formatTime = (date: string | null) => {
  if (date) {
    return new Date(date).toLocaleTimeString()
  }
  return '-'
}

onMounted(() => {
  // if (props.task) {
  //   updateTask.value = props.task
  // }
  selectedStatus.value = props.task.status
})

</script>