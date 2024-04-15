<template>
  <span>
    <span style="font-size: 2rem;">{{ date }}</span>
    <span style="font-size: 1.5rem; padding-bottom: .2rem; padding-left: .8rem; ">{{ time }}</span>
  </span>
</template>

<script setup lang="ts">
import { Ref, ref, onMounted } from 'vue'

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const date: Ref<string> = ref('')
const time: Ref<string> = ref(new Date().toLocaleString().split(',')[1])

const refreshTime = () => {
  const currDate = new Date()

  date.value = `${days[currDate.getDay()]} ${months[currDate.getMonth()]} ${currDate.getDate()}`
  time.value = new Date().toLocaleString().split(',')[1]

  // date.value = currDate.getDay() + ' ' + currDate.getMonth() + ' ' + currDate.getDay()
}

setInterval(refreshTime, 1000)

onMounted(() => {
  refreshTime()
})

</script>