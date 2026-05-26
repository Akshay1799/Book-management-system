import BookTableRow from './BookTableRow';
import { IoArrowUp, IoArrowDown, IoSwapVertical } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import { setSorting } from '../../redux/slices/bookSlices.js';

const BookTable = ({ books, isLoading }) => {
    const dispatch = useDispatch();
    const { field, order } = useSelector(state => state.books.sorting);

    const handleSort = (key) => {
        if (field === key) {
            dispatch(setSorting({ field: key, order: order === 'asc' ? 'desc' : 'asc' }));
        } else {
            dispatch(setSorting({ field: key, order: 'asc' }));
        }
    };

    const SortIcon = ({ col }) => {
        if (field !== col) return <IoSwapVertical className="inline ml-1 text-gray-300" />;
        return order === 'asc' ? <IoArrowUp className="inline ml-1 text-indigo-600" /> : <IoArrowDown className="inline ml-1 text-indigo-600" />;
    };

    const columns = [
        { label: 'Title', key: 'title', sortable: true },
        { label: 'Author', key: 'author', sortable: true },
        { label: 'Year', key: 'publishedYear', sortable: true },
        { label: 'Genre', key: 'genre', sortable: true },
        { label: 'Availability', key: 'availableCopies', sortable: true },
        { label: 'Actions', key: 'actions', sortable: false },
    ];

    if ((!books || !books.length) && !isLoading) {
        return (
            <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100/50">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50">
                    <IoSwapVertical size={32} className="text-indigo-400" />
                </div>
                <h3 className="mt-4 text-sm font-medium text-gray-900">No books found</h3>
                <p className="mt-1 text-sm text-gray-500">
                    Try adjusting your search or filters to find what you're looking for.
                </p>
            </div>
        );
    }

    return (
        <div className="relative overflow-hidden rounded-xl shadow-sm border border-gray-200 bg-white">
            {isLoading && (
                <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
                    {/* Skeleton or loader could be here, but we usually show loader in parent */}
                </div>
            )}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-20">
                                Cover
                            </th>
                            {columns.map(col => (
                                <th
                                    key={col.key}
                                    scope="col"
                                    className={`px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider ${col.sortable ? 'cursor-pointer hover:bg-gray-100 transition-colors select-none' : ''}`}
                                    onClick={() => col.sortable && handleSort(col.key)}
                                >
                                    <div className="flex items-center gap-1">
                                        {col.label}
                                        {col.sortable && <SortIcon col={col.key} />}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {books.map((book) => (
                            <BookTableRow key={book.id} book={book} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
export default BookTable;