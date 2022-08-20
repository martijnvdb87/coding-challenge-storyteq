import { ref } from "vue";

export type City = string;

export type WeatherInformation = {
  region: string;
  description: string;
  temperature: number;
  icon: string;
};

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

const weatherCache = ref<Map<City, WeatherInformation>>(new Map());

export const setWeatherInformationCache = (
  city: City,
  weatherinformation: WeatherInformation
): void => {
  weatherCache.value.set(city, weatherinformation);
};

export const getWeatherInformationCache = (
  city: string
): WeatherInformation | undefined => weatherCache.value.get(city);

export const listCities = store.value;
