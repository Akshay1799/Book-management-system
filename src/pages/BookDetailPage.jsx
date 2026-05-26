import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBookById, deleteBook } from '../redux/slices/bookSlices';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import Button from '../components/common/Button';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { IoArrowBack, IoPencil, IoTrash } from 'react-icons/io5';
import EditBookForm from '../components/books/EditBookForm';

const BookDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentBook, loading, error } = useSelector(state => state.books);
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        if (id) dispatch(fetchBookById(id));
    }, [dispatch, id]);

    // Handle delete action
    const handleDelete = async () => {
        const result = await dispatch(deleteBook(id));
        if (deleteBook.fulfilled.match(result)) {
            navigate('/');
        }
        setShowDeleteConfirm(false);
    };

    if (loading && !currentBook) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Navbar />
                <div className="grow flex items-center justify-center">
                    <Loader size="lg" />
                </div>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Navbar />
                <div className="grow max-w-7xl mx-auto px-4 py-8 w-full">
                    <ErrorMessage message={error} />
                    <Button onClick={() => navigate('/')} variant="secondary" className="mt-4">
                        <IoArrowBack className="mr-2" /> Back to Books
                    </Button>
                </div>
                <Footer />
            </div>
        );
    }

    if (!currentBook) return null;

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
            <Navbar onAddClick={() => navigate('/')} />

            <main className="grow max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center text-gray-500 hover:text-indigo-600 transition-colors font-medium "
                    >
                        <IoArrowBack className="mr-2" /> Back to Books
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[600px]">
                    {isEditing ? (
                        <div className="p-8">
                            <EditBookForm
                                book={currentBook}
                                onCancel={() => setIsEditing(false)}
                                onSuccess={() => setIsEditing(false)}
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col lg:flex-row h-full">
                            {/* Cover Image Section */}
                            <div className="lg:w-1/3 bg-gray-50/50 p-8 flex flex-col items-center border-b lg:border-b-0 lg:border-r border-gray-100 relative">
                                <div className="relative group perspective-1000 w-full max-w-[280px] mx-auto">
                                    <div className="absolute -inset-1 bg-linear-to-r from-indigo-500 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                                    <img
                                        src={currentBook.coverImage || 'https://via.placeholder.com/300x450'}
                                        alt={currentBook.title}
                                        className="relative w-full aspect-2/3 object-cover rounded-lg shadow-2xl transition-transform duration-500 transform group-hover:scale-[1.02]"
                                    />
                                </div>

                                <div className="mt-8 w-full max-w-[280px] space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                                        <span className="text-gray-500 text-sm font-medium">Rating</span>
                                        <div className="flex items-center text-amber-500 font-bold">
                                            {currentBook.rating || 'N/A'} <span className="ml-1 text-xs text-gray-400">/ 5</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                                        <span className="text-gray-500 text-sm font-medium">Pages</span>
                                        <span className="font-semibold text-gray-900">{currentBook.pages}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Details Section */}
                            <div className="lg:w-2/3 p-8 lg:p-10 flex flex-col">
                                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
                                    <div>
                                        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight mb-2">
                                            {currentBook.title}
                                        </h1>
                                        <p className="text-xl text-indigo-600 font-medium">by {currentBook.author}</p>
                                    </div>
                                    <div className="flex gap-3 shrink-0">
                                        <Button onClick={() => setIsEditing(true)} variant="secondary" className="shadow-sm border-gray-200">
                                            <IoPencil className="mr-2" /> Edit
                                        </Button>
                                        <Button onClick={() => setShowDeleteConfirm(true)} variant="danger" className="shadow-red-100 shadow-lg">
                                            <IoTrash className="mr-2" /> Delete
                                        </Button>
                                    </div>
                                </div>

                                <div className="flex gap-2 mb-8 flex-wrap">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                                        {currentBook.genre}
                                    </span>
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 border border-gray-200">
                                        {currentBook.publishedYear}
                                    </span>
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 border border-gray-200">
                                        {currentBook.language}
                                    </span>
                                </div>

                                <div className="prose prose-indigo max-w-none text-gray-600 mb-8 grow">
                                    <h3 className="text-gray-900 font-semibold text-lg mb-2">Overview</h3>
                                    <p className="leading-relaxed whitespace-pre-line">{currentBook.overview}</p>
                                </div>

                                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 mt-auto">
                                    <h3 className="text-gray-900 font-semibold mb-4 flex items-center gap-2">
                                        Book Availability
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between text-sm font-medium text-gray-600 mb-1">
                                            <span>Status</span>
                                            <span className={currentBook.availableCopies > 0 ? "text-green-600" : "text-red-600"}>
                                                {currentBook.availableCopies > 0 ? 'In Stock' : 'Out of Stock'}
                                            </span>
                                        </div>
                                        <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className={`absolute left-0 top-0 h-full rounded-full transition-all duration-1000 ${currentBook.availableCopies > 0 ? 'bg-indigo-600' : 'bg-gray-400'
                                                    }`}
                                                style={{ width: `${Math.min(100, (currentBook.availableCopies / currentBook.totalCopies) * 100)}%` }}
                                            ></div>
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-400">
                                            <span>0</span>
                                            <span className="text-gray-700 font-semibold text-sm">
                                                {currentBook.availableCopies} available / {currentBook.totalCopies} total
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-500">
                                    <div>
                                        <span className="block font-medium text-gray-900">Publisher</span>
                                        {currentBook.publisher}
                                    </div>
                                    <div>
                                        <span className="block font-medium text-gray-900">ISBN</span>
                                        <span className="font-mono">{currentBook.isbn}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <ConfirmDialog
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={handleDelete}
                title="Delete Book"
                message={`Are you sure you want to delete "${currentBook.title}"? This action cannot be undone.`}
            />
            <Footer />
        </div>
    );
};
export default BookDetailsPage;
