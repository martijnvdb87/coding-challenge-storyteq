<script setup lang="ts">
import Menu from "@/components/Menu/Menu.vue";
</script>

<template>
  <main>
    <Menu />
    <section class="container">
      <router-view></router-view>
    </section>
  </main>
</template>

<style scoped lang="scss">
.container {
  margin: auto;
  padding: 4rem 2rem;
  max-width: 64rem;
}
</style>
