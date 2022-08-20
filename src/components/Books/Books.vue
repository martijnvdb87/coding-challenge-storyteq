<script setup lang="ts">
import { ref } from "vue";
import { Book, listBooks } from "@/stores/BooksStore/BooksStore";
import Search, { DataSetItem } from "@/components/Search/Search.vue";

const query = ref("");

const dataSet: DataSetItem[] = listBooks.map((book: Book): DataSetItem => {
  return {
    key: book.title,
    value: `${book.title} - ${book.author}`,
    action: () => {
      alert(`${book.title} - ${book.author}`);
    },
  };
});
</script>

<template>
  <h1>Book ratings</h1>
  <Search v-model="query" :data-set="dataSet" /> {{ query }}
</template>

<style scoped lang="scss"></style>
