import { ref } from "vue";

export type City = string;

const store = ref<City[]>([
  "san jose",
  "santiago",
  "san francisco",
  "santa rosa",
  "san juan",
  "sabadell",
  "salamanca",
  "salt lake city",
  "salinas",
  "salem",
  "sausalito",
  "taipei",
  "tel aviv",
  "tempe",
  "termez",
  "temuco",
  "tiajuna",
  "tieling",
  "thousand oaks",
  "thunder bay",
  "tokyo",
  "tulsa",
]);

export const listCities = store.value;
