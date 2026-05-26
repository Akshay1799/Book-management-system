import booksReducer from './slices/bookSlices.js';
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
    reducer: {
      books: booksReducer,
    },
  });