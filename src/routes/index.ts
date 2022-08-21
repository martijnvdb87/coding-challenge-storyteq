import { RouteRecordRaw } from "vue-router";

import Books from "@/components/Books/Books.vue";
import Cities from "@/components/Cities/Cities.vue";

export const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Books",
    component: Books,
  },
  {
    path: "/cities/",
    name: "Cities",
    component: Cities,
  },
];
