<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    href?: string | undefined;
    target?: string;
    action?: CallableFunction | undefined;
  }>(),
  {
    href: undefined,
    target: "",
    action: undefined,
  }
);

const isInternalLink = computed(() => {
  const pattern = /^((http|https|ftp):\/\/)|mailto/;
  return !pattern.test(props.href);
});
</script>

<template>
  <router-link
    v-if="isInternalLink && props.href"
    :to="props.href"
    class="link"
  >
    <span class="link__text">
      <slot></slot>
    </span>
  </router-link>

  <a
    v-else-if="props.href"
    :href="props.href"
    :target="props.target"
    class="link"
  >
    <span class="link__text">
      <slot></slot>
    </span>
  </a>

  <a v-else-if="props.action" href="#" class="link" @click="() => props.action">
    <span class="link__text">
      <slot></slot>
    </span>
  </a>
</template>

<style scoped lang="scss"></style>
