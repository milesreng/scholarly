import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'

import App from './App.vue'
import HomeScreen from './views/HomeScreen.vue'
import DashboardScreen from './views/DashboardScreen.vue'
import LoginScreen from './views/LoginScreen.vue'
import RegisterScreen from './views/RegisterScreen.vue'

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
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardScreen
  },
  {
    path: '/login',
    name: 'login',
    component: LoginScreen
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterScreen
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
