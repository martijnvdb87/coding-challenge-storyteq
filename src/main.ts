import { createApp } from "vue";
import { Router, createRouter, createWebHistory } from "vue-router";
import { routes } from "@/routes";
import App from "./App.vue";

import "@/styles/reset.css";
import "@/styles/main.scss";

const router: Router = createRouter({
  history: createWebHistory(),
  routes,
});

createApp(App).use(router).mount("#app");
