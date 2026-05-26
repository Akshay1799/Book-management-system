// Session Storage Service for Books
// Data automatically clears when browser is closed
const STORAGE_KEY = 'books_inventory_data';
const INITIALIZED_KEY = 'books_inventory_initialized';

export const sessionStorageService = {
  // Check if data is already initialized in sessionStorage
  isInitialized: () => {
    return sessionStorage.getItem(INITIALIZED_KEY) === 'true' && !!sessionStorage.getItem(STORAGE_KEY);
  },

  // Initialize sessionStorage with data from API
  initializeData: (books) => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    sessionStorage.setItem(INITIALIZED_KEY, 'true');
  },

  // Get all books from sessionStorage
  getBooks: () => {
    const data = sessionStorage.getItem(STORAGE_KEY);
    if (!data) return [];

    try {
      return JSON.parse(data);
    } catch (error) {
      console.warn('Invalid books data in sessionStorage, resetting storage.', error);
      sessionStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(INITIALIZED_KEY);
      return [];
    }
  },

  // Get single book by ID
  getBookById: (id) => {
    const books = sessionStorageService.getBooks();
    return books.find(book => book.id === id);
  },

  // Add new book
  addBook: (bookData) => {
    const books = sessionStorageService.getBooks();
    const newBook = {
      ...bookData,
      id: Date.now().toString(), // Generate unique ID
      createdAt: new Date().toISOString()
    };
    books.push(newBook);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    return newBook;
  },

  // Update book
  updateBook: (id, bookData) => {
    const books = sessionStorageService.getBooks();
    const index = books.findIndex(book => book.id === id);
    if (index !== -1) {
      books[index] = { ...books[index], ...bookData };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(books));
      return books[index];
    }
    return null;
  },

  // Delete book
  deleteBook: (id) => {
    const books = sessionStorageService.getBooks();
    const filteredBooks = books.filter(book => book.id !== id);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(filteredBooks));
    return id;
  }
};
