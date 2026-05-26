// Local Storage Service for Books
const STORAGE_KEY = 'books_inventory_data';
const INITIALIZED_KEY = 'books_inventory_initialized';

export const localStorageService = {
  // Check if data is already initialized in localStorage
  isInitialized: () => {
    return localStorage.getItem(INITIALIZED_KEY) === 'true';
  },

  // Initialize localStorage with data from API
  initializeData: (books) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    localStorage.setItem(INITIALIZED_KEY, 'true');
  },

  // Get all books from localStorage
  getBooks: () => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  // Get single book by ID
  getBookById: (id) => {
    const books = localStorageService.getBooks();
    return books.find(book => book.id === id);
  },

  // Add new book
  addBook: (bookData) => {
    const books = localStorageService.getBooks();
    const newBook = {
      ...bookData,
      id: Date.now().toString(), // Generate unique ID
      createdAt: new Date().toISOString()
    };
    books.push(newBook);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    return newBook;
  },

  // Update book
  updateBook: (id, bookData) => {
    const books = localStorageService.getBooks();
    const index = books.findIndex(book => book.id === id);
    if (index !== -1) {
      books[index] = { ...books[index], ...bookData };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
      return books[index];
    }
    return null;
  },

  // Delete book
  deleteBook: (id) => {
    const books = localStorageService.getBooks();
    const filteredBooks = books.filter(book => book.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredBooks));
    return id;
  },

  // Reset to original data 
  reset: () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(INITIALIZED_KEY);
  }
};
