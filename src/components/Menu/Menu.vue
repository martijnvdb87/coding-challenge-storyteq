<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import Link from "@/components/Link/Link.vue";

import bookIcon from "@/assets/icons/book.svg?raw";
import sunIcon from "@/assets/icons/sun.svg?raw";

const currentRoute = computed(() => useRoute().path);
</script>

<template>
  <div class="menu">
    <div class="menu__container">
      <Link
        href="/"
        :class="[
          'menu__item',
          currentRoute === '/' ? 'menu__item--active' : '',
        ]"
      >
        <span class="menu__item-icon" v-html="bookIcon"></span>
        Alternative book titles
      </Link>
      <Link
        href="/cities"
        :class="[
          'menu__item',
          currentRoute === '/cities' ? 'menu__item--active' : '',
        ]"
      >
        <span class="menu__item-icon" v-html="sunIcon"></span>
        City weather
      </Link>
    </div>
  </div>
</template>

<style scoped lang="scss">
.menu {
  .menu__item {
    border-bottom: 0.25rem solid transparent;
    &--active {
      background-color: #eee;
      border-color: #2c99ed;

      :deep(.link__text) {
        color: #111;
      }
      :deep(svg) {
        color: #111;
      }
    }

    &-icon {
      display: grid;
    }
  }

  &__container {
    display: flex;
    justify-content: center;
    border-bottom: 1px solid #ddd;
  }

  a {
    padding: 0.75rem 1.5rem;
    text-decoration: none;
    transition: ease background-color 160ms, ease border-color 160ms,
      ease border-radius 160ms;

    &:hover {
      background-color: #eee;
    }

    :deep(.link__text) {
      display: flex;
      gap: 0.75rem;
      align-items: center;
      font-weight: 450;
      color: #111;
    }
    :deep(svg) {
      width: 1.25rem;
      height: 1.25rem;
      opacity: 0.75;
    }
  }
}
</style>
