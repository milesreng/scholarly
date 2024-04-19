<template>
  <div style="width: 100%; height: fit-content;" class="d-flex flex-column flex-md-row justify-content-center shadow border-top">
    <b-col cols="12" md="2" class="d-flex">
      <span v-if="props.task.dueDate && isLate" style="color: red;" class="align-items-center m-auto text-center">
        Due {{ formatDate(props.task.dueDate) }}
      </span>
      <span v-else-if="props.task.dueDate && props.task.status === 'complete'" class="align-items-center m-auto text-center">
        <span style="text-decoration: line-through;" class="align-items-center text-center">
          Due {{ formatDate(props.task.dueDate) }}
        </span>
        <br>
        Complete
      </span>
      <span v-else-if="props.task.dueDate" class="align-items-center m-auto text-center">
        Due {{ formatDate(props.task.dueDate) }}
      </span>
      <span v-else class="align-items-center m-auto text-center">
        No due date specified
      </span>
    </b-col>
    <b-col class="shadow py-2 px-4" cols="12" md="10">
      <b-row>
          <div class="d-flex flex-row justify-content-between" style="width: 100%;">
            <div class="d-flex flex-row align-items-center" style="gap: 1rem;">
              <span style="font-size: 1.3rem;">
                <span style="font-weight: bold;">Task:</span>
                <span>&nbsp;{{ props.task.title }}</span>
              </span>
              <!-- <span v-if="canUpdateStatus" class="d-flex flex-row" style="gap: 1rem;">
                <b-form-select
                  v-model="updateStatus"
                  :options="taskStatusChoices">
                </b-form-select>
                <span class="align-self-center p-1" v-if="updateStatus !== props.task.status" @click="handleUpdateStatus">
                  &check;
                </span>
              </span>
              <span v-else>{{ props.task.status }}</span> -->
            </div>
            <div style="align-items: center;" class="py-1" v-if="canEdit">
              <span @click="openTaskModal">
                <FontAwesomeIcon :icon="faPenToSquare" style="margin: auto;"></FontAwesomeIcon>
              </span>
              <b-modal v-model="showTaskModal" title="Edit Task" centered>
                <b-form>
                  <b-form-group
                    label="Title"
                    label-for="update-title-input"
                    label-cols="3">
                    <b-form-input
                      id="update-title-input"
                      v-model="updateTitle">
                    </b-form-input>
                  </b-form-group>
                  <b-form-group
                    label="Description"
                    label-for="update-description-input"
                    label-cols="3">
                    <b-form-textarea
                      id="update-description-input"
                      v-model="updateDesc">
                    </b-form-textarea>
                  </b-form-group>
                  <b-form-group
                    label="Due Date"
                    label-for="update-duedate-input"
                    label-cols="3">
                    <b-form-datepicker
                      id="update-duedate-input"
                      v-model="updateDueDate">
                    </b-form-datepicker>
                  </b-form-group>
                  <b-form-group
                    label="Assign to"
                    label-for="update-description-input"
                    label-cols="3">
                    <b-form-select multiple
                      id="update-description-input"
                      v-model="updateUsers"
                      :options="props.userOptions">
                    </b-form-select>
                  </b-form-group>
                  <b-form-group
                    label="Status"
                    label-for="update-status-input"
                    label-cols="3">
                    <b-form-select
                      id="update-status-input"
                      v-model="updateStatus"
                      :options="taskStatusChoices">
                      
                    </b-form-select>
                  </b-form-group>
                </b-form>
                <template #modal-footer>
                  <span class="d-flex flex-row justify-content-between" style="width: 100%;">
                    <span v-if="canEdit">
                      <b-button variant="danger" @click="handleConfirmDelete">
                        <FontAwesomeIcon :icon="faTrashCan" style="margin: auto;"></FontAwesomeIcon>
                      </b-button>
                    </span>
                    <span style="gap: 1rem;" class="d-flex flex-row">
                      <b-button @click="closeTaskModal">Cancel</b-button>
                      <b-button variant="primary" @click="handleUpdateTask">Save changes</b-button>
                    </span>
                  </span>
                </template>
              </b-modal>
              <b-modal v-model="showConfirmDeleteModal" centered size="sm">
                {{ showConfirmDeleteModal }}
                Are you sure you want to delete this task?
                <template #modal-footer>
                  <b-button @click="closeDeleteModal">Cancel</b-button>
                  <b-button variant="danger" @click="handleDeleteTask">Yes</b-button>
                </template>
              </b-modal>
            </div>
          </div>
      </b-row>
      <b-row>
        Status: {{ props.task.status }}
      </b-row>
      <b-row>
        Created by&nbsp;<span style="text-decoration: underline;">{{ props.task.creatorId }}</span>
        <span v-if="props.task.createdAt">
          &nbsp;on {{ formatDate(props.task.createdAt) }} at {{ formatTime(props.task.createdAt) }}
        </span>
      </b-row>
      <b-row>
        Assigned to&nbsp;
        <span>
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
      </b-row>
      <b-row>
        <!-- <b-form-select v-if="props.task.userIds.includes(user.preferred_username)"
          style="width: fit-content; margin: 1rem 0;"
          v-model="selectedStatus"
          :options="taskStatusChoices">
        </b-form-select> -->
      </b-row>
      <b-row v-if="props.task.description">
        Description: {{ props.task.description }}
      </b-row>
    </b-col>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref, onMounted, inject, computed } from 'vue'
import { DropdownOption } from '../types/options.types'
import { ITask, taskStatusChoices } from '../../../server/models/task.model'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faPenToSquare, faTrashCan } from '@fortawesome/free-regular-svg-icons'

interface Props {
  userOptions: DropdownOption[]
  task: ITask
}

const props = defineProps<Props>()
const emit = defineEmits(['refresh', 'delete'])

const user: Ref<any> = inject('user')!

const selectedStatus = ref('')
const updateTitle = ref('')
const updateDesc = ref('')
const updateStatus = ref('')
const updateDueDate = ref(new Date())
const updateUsers: Ref<string[]> = ref([])
const showTaskModal = ref(false)
const showConfirmDeleteModal = ref(false)

const isLate = computed(() => {
  if (!props.task.dueDate) return false
  if (props.task.status === 'complete') return false

  const then = new Date(props.task.dueDate as Date).getTime()
  return then < new Date().getTime()
})

const canEdit = computed(() => {
  return props.task.creatorId === user.value.preferred_username
})

const handleConfirmDelete = () => {
  showTaskModal.value = false
  showConfirmDeleteModal.value = true
}

const handleUpdateTask = async () => {
  if (updateTitle && updateDesc && updateUsers && updateDueDate && updateStatus) {
    const task = { title: updateTitle.value, description: updateDesc.value, userIds: updateUsers.value, dueDate: updateDueDate.value, status: updateStatus.value }
    const res = await fetch(`/api/tasks/${props.task._id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'PUT',
      body: JSON.stringify(task)
    })

    if (res.ok) {
      showTaskModal.value = false
    }

    emit('refresh')
    refresh()
  }
}

const handleDeleteTask = async () => {
  try {

    const res = await fetch(`/api/tasks/${props.task._id}`, {
      method: 'DELETE'
    })

    if (!res.ok) console.log(res)
    
  } catch (error) {
    return
  }

  showConfirmDeleteModal.value = false
  emit('refresh')
}

const openTaskModal = () => { showTaskModal.value = true }
const closeTaskModal = () => { showTaskModal.value = false }

// const openDeleteModal = () => { showConfirmDeleteModal.value = true }
const closeDeleteModal = () => { showConfirmDeleteModal.value = false }

const formatDate = (date: Date | string | null) => {
  if (date) {
    return new Date(date).toLocaleDateString()
  }
  return '-'
}

const formatTime = (date: string | null) => {
  if (date) {
    return new Date(date).toLocaleTimeString()
  }
  return '-'
}

const refresh = () => {
  updateTitle.value = props.task.title
  updateStatus.value = props.task.status
  updateDesc.value = props.task.description || ''
  updateUsers.value = props.task.userIds || []
  updateDueDate.value = props.task.dueDate || new Date()
}

onMounted(() => {
  // if (props.task) {
  //   updateTask.value = props.task
  // }
  refresh()
})

</script>