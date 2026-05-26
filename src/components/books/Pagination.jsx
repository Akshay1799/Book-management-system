import { useDispatch, useSelector } from 'react-redux';
import { setPage } from '../../redux/slices/bookSlices.js';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import Button from '../common/Button';

const Pagination = () => {
    const dispatch = useDispatch();
    const { currentPage, itemsPerPage, totalItems } = useSelector(state => state.books.pagination);

    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

    if (totalItems === 0) return null;

    return (
        <div className="flex justify-between items-center bg-white px-4 py-3 border border-gray-200 sm:px-6 rounded-xl shadow-sm">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of <span className="font-medium">{totalItems}</span> results
                    </p>
                </div>
                <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => dispatch(setPage(currentPage - 1))}
                            disabled={currentPage === 1}
                        >
                            <span className="sr-only">Previous</span>
                            <IoChevronBack className="h-5 w-5" aria-hidden="true" />
                        </button>
                        {/* Simple page numbers: show all if < 7, otherwise ellipsize (todo: complex logic). For now, simple list capped or scrollable if many pages? 
                Let's show max 5 pages around current.
            */}
                        {[...Array(totalPages)].map((_, i) => {
                            const pageNum = i + 1;
                            // Show first, last, current, and +/- 1 neighbor
                            if (pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => dispatch(setPage(pageNum))}
                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === pageNum
                                                ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                            }`}
                                    >
                                        {pageNum}
                                    </button>
                                )
                            } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                                return <span key={pageNum} className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">...</span>
                            }
                            return null;
                        })}
                        <button
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => dispatch(setPage(currentPage + 1))}
                            disabled={currentPage === totalPages}
                        >
                            <span className="sr-only">Next</span>
                            <IoChevronForward className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </nav>
                </div>
            </div>

            <div className="flex items-center justify-between sm:hidden w-full">
                <Button
                    variant="secondary"
                    onClick={() => dispatch(setPage(currentPage - 1))}
                    disabled={currentPage === 1}
                    size="sm"
                >
                    Previous
                </Button>
                <span className="text-sm font-medium text-gray-700">
                    Page {currentPage} of {totalPages}
                </span>
                <Button
                    variant="secondary"
                    onClick={() => dispatch(setPage(currentPage + 1))}
                    disabled={currentPage === totalPages}
                    size="sm"
                >
                    Next
                </Button>
            </div>
        </div>
    );
};
export default Pagination;