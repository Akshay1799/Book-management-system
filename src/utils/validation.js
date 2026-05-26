export const bookValidation = {
    title: {
      type:'text',
      required: 'Title is required',
      maxLength: { value: 200, message: 'Title cannot exceed 200 characters' },
      minLength: { value: 3, message: 'Title must be at least 3 character' }
    },
    author: {
      type:'string',
      required: 'Author is required',
      minLength: { value: 3, message: 'Author name must be at least 3 characters' },
      pattern: {
        value: /^[a-zA-Z\s.]+$/,
        message: 'Author name can only contain letters, spaces and dots'
      }
    },
    isbn: {
      required: 'ISBN is required',
      pattern: {
        value: /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/,
        message: 'Please enter a valid ISBN (10 or 13 digits)'
      }
    },
    publishedYear: {
      required: 'Published Year is required',
      // valueAsNumber converts string to number, but returns NaN if invalid.
      // We also use pattern to prevent non-digit entry if type is text by accident,
      // and validate function to ensure it is not NaN.
      valueAsNumber: true,
      validate: (value) => !isNaN(value) || 'Must be a valid number',
      min: { value: 1000, message: 'Year must be after 1000' },
      max: { value: new Date().getFullYear() + 1, message: `Year must be by ${new Date().getFullYear() + 1}` },
    },
    publisher: {
      type:'string',
      required: 'Publisher is required',
      minLength: { value: 2, message: 'Publisher must be at least 2 characters' }
    },
    genre: {
      required: 'Genre is required',
    },
    pages: {
      required: 'Pages count is required',
      valueAsNumber: true,
      validate: (value) => !isNaN(value) || 'Must be a valid number',
      min: { value: 1, message: 'Must have at least 1 page' },
      max: { value: 10000, message: 'Max 10000 pages' },
    },
    language: {
      required: 'Language is required',
      pattern: {
        value: /^[a-zA-Z\s]+$/,
        message: 'Language must contain only letters'
      }
    },
    coverImage: {
      pattern: {
        value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})(\/[^\s]*)?$/i,
        message: 'Please enter a valid URL'
      }
    },
    overview: {
      type:'string',
      required: 'Overview is required',
      minLength: { value: 20, message: 'Overview must be at least 20 characters' },
      maxLength: { value: 1000, message: 'Overview cannot exceed 1000 characters' }
    },
    availableCopies: {
      required: 'Available Copies is required',
      valueAsNumber: true,
      validate: (value) => !isNaN(value) || 'Must be a valid number',
      min: { value: 0, message: 'Cannot be negative' },
    },
    totalCopies: {
      required: 'Total Copies is required',
      valueAsNumber: true,
      validate: (value) => !isNaN(value) || 'Must be a valid number',
      min: { value: 0, message: 'Cannot be negative' },
    }
  };