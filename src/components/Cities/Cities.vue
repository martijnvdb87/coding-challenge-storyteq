<script setup lang="ts">
import { ref } from "vue";
import {
  City,
  listCities,
  WeatherInformation,
  getWeatherInformationCache,
  setWeatherInformationCache,
} from "@/stores/CitiesStore/CitiesStore";
import Search, { DataSetItem } from "@/components/Search/Search.vue";
import Loader from "@/components/Loader/Loader.vue";

const query = ref("");

const isLoading = ref(false);
const currentWeatherInformation = ref<WeatherInformation | null>(null);

const fetchWeatherInformation = async (
  city: string
): Promise<WeatherInformation | null> => {
  const cachedWeatherInformation = getWeatherInformationCache(city);
  if (cachedWeatherInformation) {
    return cachedWeatherInformation;
  }

  isLoading.value = true;
  const response = await fetch(
    `https://weatherdbi.herokuapp.com/data/weather/${city}`
  );

  if (!response.ok) {
    return null;
  }

  const data = await response.json();

  if (
    data.status === "fail" ||
    !data.region ||
    !data.currentConditions?.comment ||
    !data.currentConditions?.temp?.c ||
    !data.currentConditions?.iconURL
  ) {
    return null;
  }

  const weatherInformation: WeatherInformation = {
    region: data.region,
    description: data.currentConditions.comment,
    temperature: data.currentConditions.temp.c,
    icon: data.currentConditions.iconURL,
  };

  setWeatherInformationCache(city, weatherInformation);

  return weatherInformation;
};

const dataSet: DataSetItem[] = listCities.map((city: City): DataSetItem => {
  return {
    key: city,
    value: city,
    action: async (): Promise<void> => {
      const data = await fetchWeatherInformation(city);
      isLoading.value = false;
      currentWeatherInformation.value = data;
    },
  };
});
</script>

<template>
  <h1>Weather</h1>
  <Search v-model="query" :data-set="dataSet" />

  <div v-if="isLoading">
    <Loader />
  </div>
  <div v-else-if="currentWeatherInformation">
    <h2>{{ currentWeatherInformation.region }}</h2>
    <div>{{ currentWeatherInformation.description }}</div>
    <img :src="currentWeatherInformation.icon" />
    <div>{{ currentWeatherInformation.temperature }} °C</div>
  </div>
</template>

<style scoped lang="scss"></style>
