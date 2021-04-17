import Vue from "vue"
import VueRouter, { RouteConfig } from "vue-router"

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: "/",
    redirect: "/entrance",
  },
  {
    path: "/entrance",
    component: () => import("@/views/entrance"),
  },
  {
    path: "/studyroom",
    component: () => import("@/views/studyroom"),
    props: (route) => ({
      servant: route.query.s,
      project_id: route.query.p,
    }),
  },
]

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
})

export default router
