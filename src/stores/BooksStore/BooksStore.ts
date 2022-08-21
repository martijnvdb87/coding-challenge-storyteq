import { ref } from "vue";

export type Book = {
  title: string;
  author: string;
};

export type BookTitle = string;

export type BookInformation = {
  title: string;
};

const store = ref<Book[]>([
  {
    title: "Don Quixote",
    author: "Miguel De Cervantes",
  },
  {
    title: "Pilgrim's Progress",
    author: "John Bunyan",
  },
  {
    title: "Robinson Crusoe",
    author: "Daniel Defoe",
  },
  {
    title: "Gulliver's Travels",
    author: "Jonathan Swift",
  },
  {
    title: "Tom Jones",
    author: "Henry Fielding",
  },
  {
    title: "Clarissa",
    author: "Samuel Richardson",
  },
  {
    title: "Tristram Shandy",
    author: "Laurence Sterne",
  },
]);

export const listBooks = store.value;

const bookCache = ref<Map<BookTitle, BookTitle[]>>(new Map());

export const setBooksCache = (
  book: BookTitle,
  alternativeBooks: BookTitle[]
): void => {
  bookCache.value.set(book, alternativeBooks);
};

export const getBooksCache = (book: BookTitle): BookTitle[] | undefined =>
  bookCache.value.get(book);
