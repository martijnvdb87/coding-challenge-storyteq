<script setup lang="ts">
import { defineEmits, ref, onMounted } from "vue";
import Link from "@/components/Link/Link.vue";

export type DataSetItem = {
  key: string;
  value: string;
  action: CallableFunction;
};

const emit = defineEmits(["update:modelValue"]);

const props = withDefaults(
  defineProps<{
    modelValue: string;
    dataSet: DataSetItem[];
  }>(),
  {
    modelValue: "",
  }
);

const latestInput = ref<string>(props.modelValue);
const searchResults = ref<DataSetItem[]>([]);
const selectedIndex = ref<number>(0);
const resultsList = ref();
const searchInput = ref();

const input = (e: Event): void => {
  const value = (e.target as HTMLInputElement).value;
  latestInput.value = value;
  selectedIndex.value = 0;

  emit("update:modelValue", value);

  if (value.length >= 3) {
    const query = cleanupQuery(value);
    searchResults.value = props.dataSet.filter((item: DataSetItem) => {
      return cleanupQuery(item.key).startsWith(query);
    });
  } else {
    searchResults.value = [];
  }
};

const cleanupQuery = (value: string): string => {
  return value.toLowerCase().replace(/[^a-z0-9 ]/g, "");
};

const keydown = (e: KeyboardEvent): void => {
  if (e.code === "ArrowDown") {
    e.preventDefault();
    selectedIndex.value++;

    if (searchResults.value.length < selectedIndex.value) {
      selectedIndex.value = 0;
    }
  } else if (e.code === "ArrowUp") {
    e.preventDefault();
    selectedIndex.value--;

    if (selectedIndex.value < 0) {
      selectedIndex.value = searchResults.value.length;
    }
  } else if (e.code === "Enter") {
    const index = selectedIndex.value - 1;

    if (0 <= index && index <= searchResults.value.length) {
      searchResults.value[index].action();
    }
  }

  if (selectedIndex.value > 0) {
    emit("update:modelValue", searchResults.value[selectedIndex.value - 1].key);
  } else {
    emit("update:modelValue", latestInput.value);
  }
};

onMounted(() => {
  searchInput.value.focus();
});
</script>

<template>
  <div class="search">
    <div class="search__container">
      <input
        ref="searchInput"
        type="text"
        :value="modelValue"
        @input="input"
        @keydown="keydown"
      />
      <ol class="results-list" ref="resultsList" v-if="modelValue !== ''">
        <li
          class="results-list__item"
          :class="0 === selectedIndex ? 'results-list__item--selected' : ''"
        >
          {{ latestInput }}
        </li>
        <li
          v-for="(searchResult, index) in searchResults"
          :key="index"
          @click="() => searchResult.action()"
          :class="
            index + 1 === selectedIndex ? 'results-list__item--selected' : ''
          "
        >
          <Link :action="searchResult.action">{{ searchResult.value }}</Link>
        </li>
      </ol>
    </div>
  </div>
</template>

<style scoped lang="scss">
.results-list {
  &__item {
    &--selected {
      background-color: #eee;
    }
  }
}
</style>
