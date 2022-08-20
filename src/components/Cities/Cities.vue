<script setup lang="ts">
import { ref } from "vue";
import { City, listCities } from "@/stores/CitiesStore/CitiesStore";
import Search, { DataSetItem } from "@/components/Search/Search.vue";

const query = ref("");

type WeatherInformation = {
  description: string;
  temperature: number;
  icon: string;
};

const fetchWeatherInformation = async (
  city: string
): Promise<WeatherInformation | null> => {
  const response = await fetch(
    `https://weatherdbi.herokuapp.com/data/weather/${city}`
  );

  if (!response.ok) {
    return null;
  }

  const data = await response.json();

  if (
    data.status === "fail" ||
    !data.currentConditions?.comment ||
    !data.currentConditions?.temp?.c ||
    !data.currentConditions?.iconURL
  ) {
    return null;
  }

  return {
    description: data.currentConditions.comment,
    temperature: data.currentConditions.temp.c,
    icon: data.currentConditions.iconURL,
  };
};

const dataSet: DataSetItem[] = listCities.map((city: City): DataSetItem => {
  return {
    key: city,
    value: city,
    action: async () => {
      const data = await fetchWeatherInformation(city);
      console.log(data);
    },
  };
});
</script>

<template>
  <div>Cities</div>
  <Search v-model="query" :data-set="dataSet" />
</template>

<style scoped lang="scss"></style>
