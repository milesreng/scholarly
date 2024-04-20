import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'

import App from './App.vue'
import DashboardScreen from './views/DashboardScreen.vue'
import ProjectScreen from './views/ProjectScreen.vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './style.css'

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: DashboardScreen,
  },
  {
    path: '/project/:projectId',
    name: 'project',
    component: ProjectScreen,
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

createApp(App)
  .use(BootstrapVue)
  .use(BootstrapVueIcons)
  .use(router)
  .mount('#app')
