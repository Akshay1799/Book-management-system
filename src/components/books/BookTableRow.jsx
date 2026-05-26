import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { deleteBook } from '../../redux/slices/bookSlices';
import { IoEye, IoTrash } from 'react-icons/io5';
import Button from '../common/Button';
import ConfirmDialog from '../common/ConfirmDialog';

const BookTableRow = React.memo(({ book }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isDeleting, setIsDeleting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        await dispatch(deleteBook(book.id));
        setIsDeleting(false);
        setShowConfirm(false);
    };

    const handleRowClick = () => {
        navigate(`/books/${book.id}`);
    };

    return (
        <>
            <tr
                onClick={handleRowClick}
                className="hover:bg-indigo-50/30 transition-colors cursor-pointer group"
            >
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-14 w-10 shrink-0">
                        <img
                            src={book.coverImage || 'https://via.placeholder.com/150'}
                            alt={book.title}
                            className="h-14 w-10 object-cover rounded shadow-md"
                            loading="lazy"
                        />
                    </div>
                </td>
                <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 line-clamp-1 pr-4">{book.title}</div>
                    {/* Mobile view could show author here if hidden? But table is horizontal scroll */}
                </td>
                <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 line-clamp-1">{book.author}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {book.publishedYear}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                        {book.genre}
                    </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                        <div className={`h-2.5 w-2.5 rounded-full mr-2 ${book.availableCopies > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className="font-medium text-gray-700">
                            {book.availableCopies} / {book.totalCopies}
                        </span>
                    </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" onClick={handleRowClick} className="text-gray-400 hover:text-indigo-600 p-1.5" title="View Details">
                            <IoEye size={20} />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowConfirm(true)}
                            className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5"
                            title="Delete Book"
                        >
                            <IoTrash size={20} />
                        </Button>
                    </div>
                </td>
            </tr>

            <ConfirmDialog
                isOpen={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={handleDelete}
                title="Delete Book"
                message={`Are you sure you want to delete "${book.title}"? This action cannot be undone.`}
                isLoading={isDeleting}
            />
        </>
    );
});
export default BookTableRow;
