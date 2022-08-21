<script setup lang="ts">
import { ref } from "vue";
import {
  Book,
  listBooks,
  BookInformation,
  BookTitle,
  getBooksCache,
  setBooksCache,
} from "@/stores/BooksStore/BooksStore";
import Search, { DataSetItem } from "@/components/Search/Search.vue";
import Loader from "@/components/Loader/Loader.vue";

const query = ref("");
const isLoading = ref(false);
const searchResults = ref<string[]>([]);

const fetchBookInformation = async (book: BookTitle): Promise<BookTitle[]> => {
  const cachedBooks = getBooksCache(book);
  if (cachedBooks) {
    return cachedBooks;
  }

  isLoading.value = true;
  const response = await fetch(`https://openlibrary.org/search.json?q=${book}`);

  if (!response.ok) {
    return [];
  }

  const data = await response.json();

  if (!data.docs) {
    return [];
  }

  const titles: BookTitle[] = data.docs.map((book: BookInformation) => {
    return book.title;
  });

  const books = [...new Set(titles)] as BookTitle[];

  setBooksCache(book, books);

  return books;
};

const dataSet: DataSetItem[] = listBooks.map((book: Book): DataSetItem => {
  return {
    key: book.title,
    value: `${book.title}<div class='book-result__author'>${book.author}</div>`,
    action: async () => {
      searchResults.value = await fetchBookInformation(
        `${book.title} ${book.author}`
      );
      isLoading.value = false;
    },
  };
});
</script>

<template>
  <h1>Alternative book titles</h1>
  <Search
    v-model="query"
    :data-set="dataSet"
    placeholder="Find alternative book titles"
  />

  <div v-if="isLoading">
    <Loader />
  </div>
  <ul v-else class="book-results__list">
    <li
      class="book-results__item"
      v-for="(title, index) in searchResults"
      :key="index"
    >
      {{ title }}
    </li>
  </ul>
</template>

<style lang="scss">
.book-result__author {
  font-size: 0.75rem;
  color: #666;
  margin-top: 0.125rem;
}
.book-results {
  &__list {
    padding: 2rem;
  }
  &__item {
    margin-bottom: 0.5rem;

    &::marker {
      color: #2c99ed;
    }
  }
}
</style>
