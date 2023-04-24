import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'
import Play from '../views/Play.vue'
import Login from "../views/Login.vue"
import Profile from "../views/Profile.vue"
    

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    alias: ["/home"],
    name: 'home',
    component: Home
  },
  {
    path: "/play/:puzzleId",
    name: "play",
    component: Play,
    props: true
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/profile',
    name: 'profile',
    component: Profile
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
