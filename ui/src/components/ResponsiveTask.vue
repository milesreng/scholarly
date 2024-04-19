<template>
  <b-container style="margin: 1rem 0; padding: 1rem; width: 100%;" class="border">
    <b-row class="d-none d-md-flex">
      <b-col cols="2">
        {{ formatDate(props.task.dueDate) }}
      </b-col>
      <b-col cols="5">
        <span>
          {{ props.task.title }}
        </span>
        <span v-if="props.task.description"
          style="opacity: 80%; font-size: .9rem;">
          <br></br>
          {{ props.task.description }}
        </span>
      </b-col>
      <b-col>
        <TaskStatus :status="props.task.status"></TaskStatus>
      </b-col>
      <b-col>
        {{ props.task.userIds }}
      </b-col>
    </b-row>
    <b-row class="d-flex d-md-none">
      <b-col cols="12">
        <span>
          {{ props.task.title }}
        </span>
        <span v-if="props.task.description"
          style="opacity: 80%; font-size: .9rem;">
          <br></br>
          {{ props.task.description }}
        </span>
      </b-col>
      <b-col cols="12">
        {{ formatDate(props.task.dueDate) }}
      </b-col>
      <b-col cols="6">
        <TaskStatus :status="props.task.status"></TaskStatus>
      </b-col>
      <b-col cols="6">
        {{ props.task.userIds }}
      </b-col>
    </b-row>
  </b-container>
</template>

<script setup lang="ts">
import TaskStatus from './TaskStatus.vue'
import { ITask } from '../../../server/models/task.model'

interface Props {
  task: ITask
}

const props = defineProps<Props>()

const formatDate = (date: Date | string | null) => {
  if (date) {
    return new Date(date).toLocaleDateString()
  }
  return '-'
}

// const formatTime = (date: string | null) => {
//   if (date) {
//     return new Date(date).toLocaleTimeString()
//   }
//   return '-'
// }

</script>