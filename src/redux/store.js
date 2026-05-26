import { configureStore } from '@reduxjs/toolkit';
import booksReducer from './slices/bookSlices.js';

export const store = configureStore({
  reducer: {
    books: booksReducer,
  },
});
