import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'

import App from './App.vue'
import HomeScreen from './views/HomeScreen.vue'
import ProjectDashboardScreen from './views/ProjectDashboardScreen.vue'
import TaskScreen from './views/TaskScreen.vue'
import ProfileScreen from './views/ProfileScreen.vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './style.css'

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: TaskScreen,
  },
  {
    path: '/:projectId',
    component: TaskScreen,
    props: ({ params: { projectId }}) => ({ projectId })
  },
  {
    path: '/projects/:projectId',
    component: ProjectDashboardScreen,
    props: ({ params: { projectId }}) => ({ projectId })
  },
  {
    path: '/projects',
    component: ProjectDashboardScreen
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileScreen
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

createApp(App)
  .use(BootstrapVue)
  .use(BootstrapVueIcons)
  .use(router)
  .mount('#app')
