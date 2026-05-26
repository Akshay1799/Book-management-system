# Book Management System

A modern, full-featured book management system built with React, Redux Toolkit, and Tailwind CSS.

## 🚀 Features

- Complete CRUD Operations for books
- Advanced Search with regex support
- Sort & Filter by genre, year, availability
- Pagination with customizable items per page
- Fully Responsive design
- Modern UI with Tailwind CSS
- Redux State Management
- Real-time Validation with react-hook-form
- Detailed Book Pages with all information
- Deployed on Vercel (Zero backend hassle!)

## 🛠️ Tech Stack

Frontend: React 19, Vite
State Management: Redux Toolkit
Styling: Tailwind CSS
Form Handling: React Hook Form
Routing: React Router v7
API/Backend: My JSON Server (GitHub-based)
Icons: React Icons
Notifications: React Hot Toast

# 📦 Installation

# Clone the repository

```
git clone https://github.com/Akshay1799/Book-management-system

```

# Navigate to project directory

```
cd Book-management-system
```

# Install dependencies

```
npm install
```

# Run development server (with local json-server)

```
npm run dev
```

# Or run just frontend (uses My JSON Server from GitHub)

```
npm run client
```

# 🌐 Deployment

This app is deployed on Vercel and uses My JSON Server for the backend - no database or backend server deployment needed!

## Deploy Your Own

Push to GitHub:

```
git add .
git commit -m "Ready for deployment."
git push origin main
```

## Deploy to Vercel:

- Go to vercel.com
- Import your GitHub repository
- Deploy! ✨

The app automatically uses My JSON Server, which serves your db.json file from GitHub as a REST API.

📱 API Endpoints
The app uses these endpoints (automatically provided by My JSON Server):

GET /books - Get all books
GET /books/:id - Get book by ID
POST /books - Add new book
PUT /books/:id - Update book
DELETE /books/:id - Delete book

Note: My JSON Server is read-only for POST/PUT/DELETE in production (simulates success). 
For full write functionality, you can deploy your own JSON Server or use a real backend.

📂 Project Structure
Book-management-system/
├── src/
     ├── api/  
│   ├── components/     # Reusable components
│   ├── pages/          # Page components
│   ├── redux/          # Redux store & slices
│   ├── services/       # API configuration
│   ├── utils/          # Utilities & validation
│   └── App.jsx         # Main app component
├── db.json             # Database (served by My JSON Server)
├── vercel.json         # Vercel configuration
└── package.json        # Dependencies

# 🎯 Key Features Explained

- Search & Filter
- Search books by title, author, or ISBN using regex
- Filter by genre
- Sort by title, author, year, or availability
- CRUD Operations
- Create: Add new books with complete validation
- Read: View all books in the table, see detailed book pages
- Update: Edit book information inline
- Delete: Remove books with a confirmation dialog
- State Management
- Centralized Redux store
- Async thunks for API calls
- Optimistic UI updates
- Error handling with toast notifications

## 🔧 Development

# Run with local JSON Server backend

```
npm run dev
```

# Build for production

```
npm run build
```

# Preview production build

```
npm run preview
```

## 📝 Environment Variables

Create a .env.local file for local development:

VITE_API_BASE_URL=[http://localhost:5001](http://localhost:5001)
For production, the app uses My JSON Server automatically.

## 👨‍💻 Author

Akshay Ladne

GitHub: @Akshay1799

Live Demo: [Link](https://book-management-system-amber-three.vercel.app/)

