import toast from 'react-hot-toast';
import api from '../../services/api.js';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const fetchBooks = createAsyncThunk(
  'books/fetchBooks',
    async ({ page, limit, search, sort, order, genre }, { rejectWithValue }) => {
    try {
      const isSearching = !!search;

      let params = {};
      
      if (isSearching) {
        params._page = 1;
        params._per_page = 1000000; 
      } else {
        params._page = page;
        params._per_page = limit;
      }

      if (sort) {
        params._sort = sort;
        params._order = order;
      }
      if (genre && genre !== 'all') params.genre = genre;

      const response = await api.get('/books', { params });
      
      // Extract the raw list of books
      let allFetchedBooks = [];
      let serverTotal = 0;

      // Handle json-server response structure
      if (response.data.data && Array.isArray(response.data.data)) {
         allFetchedBooks = response.data.data;
         serverTotal = response.data.items || allFetchedBooks.length;
      } 

      // Handle flat response
      else if (Array.isArray(response.data)) {
         allFetchedBooks = response.data;
         serverTotal = response.headers['x-total-count'] || allFetchedBooks.length;
      } else {
        console.warn('Unexpected API response structure', response.data);
        return { data: [], total: 0 };
      }

      // If we are NOT searching, return directly (Server-side pagination used)
      if (!isSearching) {
          return { 
             data: allFetchedBooks, 
             total: parseInt(serverTotal) 
          };
      }

      // FILTERING
      const regex = new RegExp(search, 'i'); // Case-insensitive regex
      
      const filteredBooks = allFetchedBooks.filter(book => {
          return (
             (book.title && regex.test(book.title)) ||
             (book.author && regex.test(book.author)) ||
             (book.isbn && regex.test(book.isbn))
          );
      });

      // Manual Pagination on the filtered list
      const totalItems = filteredBooks.length;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedBooks = filteredBooks.slice(startIndex, endIndex);

      return {
          data: paginatedBooks,
          total: totalItems
      };

    } catch (error) {
       console.error('Fetch Books Error:', error);
       toast.error('Failed to fetch books');
      return rejectWithValue(error.message);
    }
  }
);

export const fetchBookById = createAsyncThunk(
  'books/fetchBookById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/books/${id}`);
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch book details');
      return rejectWithValue(error.message);
    }
  }
);

export const addBook = createAsyncThunk(
  'books/addBook',
  async (bookData, { rejectWithValue }) => {
    try {
      // Normalize ISBN: remove all non-alphanumeric characters (dashes, spaces, etc.)
      const normalizeIsbn = (isbn) => isbn.replace(/[^a-zA-Z0-9]/g, '');
      const newBookIsbnNormalized = normalizeIsbn(bookData.isbn);

      // Fetch all books to check for duplicates robustly
      // We can't rely on json-server exact match query because of format differences (dashes)
      const allBooksResponse = await api.get('/books');
      
      let allBooks = [];
      if (allBooksResponse.data.data && Array.isArray(allBooksResponse.data.data)) {
        allBooks = allBooksResponse.data.data;
      } else if (Array.isArray(allBooksResponse.data)) {
        allBooks = allBooksResponse.data;
      }

      const duplicate = allBooks.find(book => 
        book.isbn && normalizeIsbn(book.isbn) === newBookIsbnNormalized
      );
      
      if (duplicate) {
        toast.error('Book with this ISBN already exists');
        return rejectWithValue('Book with this ISBN already exists');
      }

      const response = await api.post('/books', {
        ...bookData,
        createdAt: new Date().toISOString()
      });
      toast.success('Book added successfully');
      return response.data;
    } catch (error) {
       if (error !== 'Book with this ISBN already exists' && !error.message?.includes('Book with this ISBN already exists')) {
          toast.error('Failed to add book');
       }
      return rejectWithValue(error.message || error);
    }
  }
);

export const updateBook = createAsyncThunk(
  'books/updateBook',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/books/${id}`, data);
      toast.success('Book updated successfully');
      return response.data;
    } catch (error) {
      toast.error('Failed to update book');
      return rejectWithValue(error.message);
    }
  }
);

export const deleteBook = createAsyncThunk(
  'books/deleteBook',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/books/${id}`);
      toast.success('Book deleted successfully');
      return id;
    } catch (error) {
      toast.error('Failed to delete book');
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  items: [],
  currentBook: null,
  loading: false,
  error: null,
  filters: {
    search: '',
  },
  sorting: {
    field: null,
    order: null,
  },
  pagination: {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
  },
};

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    setSearch: (state, action) => {
      state.filters.search = action.payload;
      state.pagination.currentPage = 1; // Reset to page 1 on filter change
    },
    setGenre: (state, action) => {
      state.filters.genre = action.payload;
      state.pagination.currentPage = 1;
    },
    setSorting: (state, action) => {
      state.sorting = action.payload;
    },
    setPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    clearCurrentBook: (state) => {
      state.currentBook = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Books
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.pagination.totalItems = action.payload.total;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Book By Id
      .addCase(fetchBookById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBook = action.payload;
      })
      .addCase(fetchBookById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Book
      .addCase(addBook.fulfilled, () => {
        toast.success('Book added successfully');
      })
      // Update Book
      .addCase(updateBook.fulfilled, (state, action) => {
        if (state.currentBook && state.currentBook.id === action.payload.id) {
          state.currentBook = action.payload;
        }
        const index = state.items.findIndex(b => b.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Delete Book
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.items = state.items.filter(book => book.id !== action.payload);
        if (state.currentBook && state.currentBook.id === action.payload) {
          state.currentBook = null;
        }
      });
  },
});

export const { setSearch, setGenre, setSorting, setPage, clearCurrentBook } = booksSlice.actions;
export default booksSlice.reducer;