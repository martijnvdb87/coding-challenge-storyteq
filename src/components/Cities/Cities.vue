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
  <h1>City weather</h1>
  <Search
    v-model="query"
    :data-set="dataSet"
    placeholder="Search city weather"
  />

  <div v-if="isLoading">
    <Loader />
  </div>
  <div class="weather-information" v-else-if="currentWeatherInformation">
    <div class="weather-information__graphic">
      <img
        class="weather-information__icon"
        :src="currentWeatherInformation.icon"
      />
      <div class="weather-information__temperature">
        <div class="weather-information__temperature-value">
          {{ currentWeatherInformation.temperature }}
        </div>
        <div class="weather-information__temperature-unit">°C</div>
      </div>
    </div>
    <div class="weather-information__location">
      <h2 class="weather-information__region">
        {{ currentWeatherInformation.region }}
      </h2>
      <div class="weather-information__description">
        {{ currentWeatherInformation.description }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.weather-information {
  margin: auto;
  padding: 5rem 0;
  display: flex;
  color: #111;
  gap: 1.5rem;
  justify-content: center;

  &__graphic {
    display: flex;
    gap: 0.5rem;
  }

  &__icon {
    width: 4rem;
    height: 4rem;
  }

  &__temperature {
    display: flex;

    &-value {
      font-size: 2.65rem;
      font-weight: 500;
    }
    &-unit {
      font-weight: 300;
      color: #666;
      padding-top: 0.5rem;
    }
  }

  &__description {
    font-weight: 300;
    color: #666;
  }
}
</style>
