import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import BookDetailsPage from './pages/BookDetailPage.jsx';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/books/:id" element={<BookDetailsPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
