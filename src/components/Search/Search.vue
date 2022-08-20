<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import Link from "@/components/Link/Link.vue";

import searchIcon from "@/assets/icons/search.svg";
import editIcon from "@/assets/icons/edit.svg";
import infoIcon from "@/assets/icons/info.svg";

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
const hasSearchFocus = ref(false);

const input = (e: Event): void => {
  const value = (e.target as HTMLInputElement).value;
  filterResults(value);
  hasSearchFocus.value = true;
};

const filterResults = (value: string): void => {
  latestInput.value = value;
  emit("update:modelValue", value);
  selectedIndex.value = 0;

  if (value.length >= 3) {
    const query = cleanupQuery(value);
    searchResults.value = props.dataSet
      .filter((item: DataSetItem) => {
        return cleanupQuery(item.key).startsWith(query);
      })
      .map((item: DataSetItem) => {
        return {
          ...item,
          value: ((): string => {
            return `<strong>${item.value.slice(
              0,
              value.length
            )}</strong>${item.value.slice(value.length)}`;
          })(),
        };
      });
  } else {
    searchResults.value = [];
  }
};

const cleanupQuery = (value: string): string => {
  return value.toLowerCase();
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
      click(searchResults.value[index]);
    }
  }

  if (selectedIndex.value > 0) {
    emit("update:modelValue", searchResults.value[selectedIndex.value - 1].key);
  } else {
    emit("update:modelValue", latestInput.value);
  }
};

const focus = (): void => {
  hasSearchFocus.value = true;
};

const click = (searchResult: DataSetItem): void => {
  searchResult.action();
  hasSearchFocus.value = false;
  filterResults(searchResult.key);
  searchInput.value.blur();
};

onMounted((): void => {
  document.body.addEventListener("click", blur);
  searchInput.value.focus();

  setTimeout(() => {
    focus();
  }, 100);
});

onUnmounted((): void => {
  document.body.removeEventListener("click", blur);
});

const blur = (): void => {
  hasSearchFocus.value = false;
};
</script>

<template>
  <div
    @click.stop
    class="search"
    :class="hasSearchFocus && modelValue !== '' ? 'search--focus' : ''"
  >
    <div class="search__container">
      <div class="search__input">
        <img :src="searchIcon" />
        <input
          ref="searchInput"
          type="text"
          :value="modelValue"
          @input="input"
          @keydown="keydown"
          @focus="focus"
          autocomplete="off"
          spellcheck="false"
        />
      </div>
      <ol class="results-list" ref="resultsList">
        <li
          class="results-list__item"
          :class="[
            0 === selectedIndex ? 'results-list__item--selected' : '',
            'results-list__item--current',
          ]"
        >
          <img :src="editIcon" />
          {{ latestInput }}
        </li>
        <li
          class="results-list__item results-list__item--too-short"
          v-if="modelValue.length < 3"
        >
          <img :src="infoIcon" />
          Search query too short
        </li>
        <li
          class="results-list__item results-list__item--no-results"
          v-else-if="searchResults.length === 0"
        >
          <img :src="infoIcon" />
          No results found
        </li>
        <li
          v-for="(searchResult, index) in searchResults"
          :key="index"
          @click="click(searchResult)"
          :class="[
            'results-list__item',
            index + 1 === selectedIndex ? 'results-list__item--selected' : '',
          ]"
        >
          <Link :action="searchResult.action">
            <img :src="searchIcon" />
            <span v-html="searchResult.value"></span>
          </Link>
        </li>
      </ol>
    </div>
  </div>
</template>

<style scoped lang="scss">
.search {
  &__container {
    isolation: isolate;
    position: relative;
  }
  &__input {
    position: relative;
    display: grid;
    border: 1px solid #ccc;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.05);
    border-radius: 0.5rem;

    img {
      position: absolute;
      padding: 1.125rem;
      height: 100%;
      pointer-events: none;
      opacity: 0.65;
    }
  }
  input {
    font-size: 1.5rem;
    padding: 0.75rem;
    padding-left: 3.75rem;
    font-weight: 350;
    border: none;
    background-color: transparent;
    outline: none;
  }

  &--focus {
    .search__input {
      border-radius: 0.5rem 0.5rem 0rem 0rem;
    }
    .results-list {
      pointer-events: all;
      opacity: 1;
      transform: none;
    }
  }
}
.results-list {
  position: absolute;
  top: calc(100% - 1px);
  padding: 0;
  margin: 0;
  width: 100%;
  background-color: #fff;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
  list-style: none;
  pointer-events: none;
  opacity: 0;
  border: 1px solid #ccc;
  border-top: none;
  border-radius: 0rem 0rem 0.5rem 0.5rem;
  overflow: hidden;
  transform-origin: 0% 0%;
  transform: scaleY(0.9);
  transition: ease transform 200ms, ease opacity 200ms;

  &__item {
    border-left: 0.25rem solid transparent;

    img {
      width: 1rem;
      height: 1rem;
      opacity: 0.65;
    }

    a {
      display: block;
      padding: 0.75rem 1.25rem;
      text-decoration: none;
      color: #111;

      ::v-deep .link__text {
        display: flex;
        gap: 1rem;
        align-items: center;
      }
    }
    &:hover {
      background-color: #eee;
    }

    &--selected {
      border-color: #2c99ed;
      background-color: #eee;
    }

    &--current,
    &--no-results,
    &--too-short {
      padding: 0.75rem 1.25rem;
      display: flex;
      gap: 1rem;
      align-items: center;
    }
    &--no-results,
    &--too-short {
      font-size: 0.875rem;
      font-weight: 300;
      color: #555;
    }
  }
}
</style>
