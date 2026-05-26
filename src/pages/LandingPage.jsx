import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooks } from '../redux/slices/bookSlices.js';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import BookTable from '../components/books/BookTable';
import BookFilters from '../components/books/BookFilters';
import Pagination from '../components/books/Pagination';
import Modal from '../components/common/Modal';
import AddBookForm from '../components/books/AddBookForm';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';

const LandingPage = () => {
    const dispatch = useDispatch();
    const { items, loading, error, filters, sorting, pagination } = useSelector(state => state.books);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchBooks({
            page: pagination.currentPage,
            limit: pagination.itemsPerPage,
            search: filters.search,
            sort: sorting.field,
            order: sorting.order,
            genre: filters.genre
        }));
    }, [dispatch, pagination.currentPage, pagination.itemsPerPage, filters, sorting]);

    const handleBookAdded = () => {
        setIsAddModalOpen(false);
        // Reload books
        dispatch(fetchBooks({
            page: pagination.currentPage,
            limit: pagination.itemsPerPage,
            search: filters.search,
            sort: sorting.field,
            order: sorting.order,
            genre: filters.genre
        }));
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans">
            <Navbar onAddClick={() => setIsAddModalOpen(true)} />

            <main className="grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <h1 className="text-2xl font-bold text-gray-900">All Books</h1>
                    <BookFilters />
                </div>

                {error && <ErrorMessage message={error} />}

                {loading && !items.length ? (
                    <div className="h-96 flex items-center justify-center">
                        <Loader size="lg" />
                    </div>
                ) : (
                    <>
                        <BookTable books={items} isLoading={loading} />
                        <Pagination />
                    </>
                )}
            </main>

            <Footer />

            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Add New Book"
                className="max-w-3xl"
            >
                <AddBookForm onSuccess={handleBookAdded} onCancel={() => setIsAddModalOpen(false)} />
            </Modal>
        </div>
    );
};
export default LandingPage;