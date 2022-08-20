import { RouteRecordRaw } from "vue-router";

import Home from "@/components/Home/Home.vue";
import Books from "@/components/Books/Books.vue";
import Cities from "@/components/Cities/Cities.vue";

export const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/books/",
    name: "Books",
    component: Books,
  },
  {
    path: "/cities/",
    name: "Cities",
    component: Cities,
  },
];
