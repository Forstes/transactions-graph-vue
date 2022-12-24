import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    component: () => import("/src/views/Main.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

/* router.beforeEach((to, from, next) => {

}) */
export default router;
