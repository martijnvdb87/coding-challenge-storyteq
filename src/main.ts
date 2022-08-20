import { createApp } from "vue";
import { Router, createRouter, createWebHistory } from "vue-router";
import { routes } from "@/routes";
import App from "./App.vue";

const router: Router = createRouter({
  history: createWebHistory(),
  routes,
});

createApp(App).use(router).mount("#app");
