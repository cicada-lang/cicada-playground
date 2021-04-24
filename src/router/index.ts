import Vue from "vue"
import VueRouter, { RouteConfig } from "vue-router"

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  // {
  //   // NOTE welcome and about the this project
  //   path: "/",
  //   redirect: "/entrance",
  // },
  {
    path: "/",
    redirect: "/entrance",
  },
  // {
  //   // NOTE show library list developed by a person
  //   path: "/person",
  //   component: () => import("@/views/person-dashboard"),
  //   props: (route) => ...,
  // },
  {
    // NOTE a form go to studyroom, with some list for newcomers
    path: "/entrance",
    component: () => import("@/views/entrance"),
  },
  {
    // NOTE study of one library
    path: "/studyroom",
    component: () => import("@/views/studyroom"),
    props: (route) => ({
      servant: route.query.s,
      library_id: route.query.p,
    }),
  },
]

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
})

export default router
