import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'

import App from './App.vue'
import HomeScreen from './views/HomeScreen.vue'
import DashboardScreen from './views/DashboardScreen.vue'
import TaskScreen from './views/TaskScreen.vue'
import ProfileScreen from './views/ProfileScreen.vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './style.css'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeScreen
  },
  {
    path: '/dashboard/:projectId/tasks',
    component: TaskScreen,
    props: ({ params: { projectId }}) => ({ projectId })
  },
  {
    path: '/dashboard/:projectId',
    component: DashboardScreen,
    props: ({ params: { projectId }}) => ({ projectId })
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardScreen,
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
