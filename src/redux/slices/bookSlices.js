import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { sessionStorageService } from '../../services/sessionStorageService';
import toast from 'react-hot-toast';

// Fetch books - First time se API, then localStorage
export const fetchBooks = createAsyncThunk(
  'books/fetchBooks',
  async ({ page, limit, search, sort, order, genre }, { rejectWithValue }) => {
    try {
      let allBooks = [];

      // Check if sessionStorage already has data
      if (sessionStorageService.isInitialized()) {
        allBooks = sessionStorageService.getBooks();
      }

      // If sessionStorage was empty or invalid, fetch from the public JSON source
      if (!allBooks.length) {
        const response = await api.get('db.json');
        const responseData = response.data;

        if (Array.isArray(responseData)) {
          allBooks = responseData;
        } else if (responseData && Array.isArray(responseData.books)) {
          allBooks = responseData.books;
        } else {
          allBooks = [];
        }

        if (allBooks.length) {
          sessionStorageService.initializeData(allBooks);
          toast.success('Data loaded successfully!');
        }
      }

      // Apply filtering
      let filteredBooks = allBooks;

      // Genre filter
      if (genre && genre !== 'all') {
        filteredBooks = filteredBooks.filter(book => book.genre === genre);
      }

      // Search filter
      if (search) {
        const regex = new RegExp(search, 'i');
        filteredBooks = filteredBooks.filter(book => 
          (book.title && regex.test(book.title)) ||
          (book.author && regex.test(book.author)) ||
          (book.isbn && regex.test(book.isbn))
        );
      }

      // Apply sorting
      if (sort) {
        filteredBooks.sort((a, b) => {
          let aVal = a[sort];
          let bVal = b[sort];
          
          // Handle numbers
          if (typeof aVal === 'number' && typeof bVal === 'number') {
            return order === 'asc' ? aVal - bVal : bVal - aVal;
          }
          
          // Handle strings
          aVal = String(aVal || '').toLowerCase();
          bVal = String(bVal || '').toLowerCase();
          
          if (order === 'asc') {
            return aVal > bVal ? 1 : -1;
          } else {
            return aVal < bVal ? 1 : -1;
          }
        });
      }

      // Pagination
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
      // Get from localStorage
      const book = sessionStorageService.getBookById(id);
      
      if (!book) {
        toast.error('Book not found');
        return rejectWithValue('Book not found');
      }
      
      return book;
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
      // Normalize ISBN
      const normalizeIsbn = (isbn) => isbn.replace(/[^a-zA-Z0-9]/g, '');
      const newBookIsbnNormalized = normalizeIsbn(bookData.isbn);

      // Check for duplicates
      const allBooks = sessionStorageService.getBooks();
      const duplicate = allBooks.find(book => 
        book.isbn && normalizeIsbn(book.isbn) === newBookIsbnNormalized
      );
      
      if (duplicate) {
        toast.error('Book with this ISBN already exists');
        return rejectWithValue('Book with this ISBN already exists');
      }

      // Add to localStorage
      const newBook = sessionStorageService.addBook(bookData);
      toast.success('Book added successfully');
      return newBook;
    } catch (error) {
      toast.error('Failed to add book');
      return rejectWithValue(error.message || error);
    }
  }
);

export const updateBook = createAsyncThunk(
  'books/updateBook',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const updatedBook = sessionStorageService.updateBook(id, data);
      
      if (!updatedBook) {
        toast.error('Book not found');
        return rejectWithValue('Book not found');
      }
      
      toast.success('Book updated successfully');
      return updatedBook;
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
      sessionStorageService.deleteBook(id);
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
      state.pagination.currentPage = 1;
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
        // Re-fetch will happen from component
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
