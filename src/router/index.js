import {
  createRouter as createVueRouter,
  createWebHashHistory,
  createWebHistory,
} from "vue-router";
import ModelView from "../views/ModelView.vue";
import { createAuthGuard } from "@auth0/auth0-vue";
import HelloWorld from "@/components/HelloWorld.vue";
import TheWelcome from "@/components/TheWelcome.vue";

export function createRouter(app) {
  return createVueRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
      {
        path: "/",
        name: "home",
        component: HelloWorld,
        // beforeEnter: createAuthGuard(app),
      },
      {
        path: "/welcome",
        name: "welcome",
        component: TheWelcome,
        // beforeEnter: createAuthGuard(app),
      },
      {
        path: "/model",
        name: "model",
        component: ModelView,
        // beforeEnter: createAuthGuard(app),
      },
      {
        path: "/pf",
        name: "pf",
        // route level code-splitting
        // this generates a separate chunk (About.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import("../views/PfView.vue"),
        // beforeEnter: createAuthGuard(app),
      },
    ],
    // history: createWebHashHistory()
  });
}
