import { useDispatch, useSelector } from 'react-redux';
import { setGenre } from '../../redux/slices/bookSlices.js';

const GENRES = ['Fiction', 'Non-Fiction', 'Sci-Fi', 'Mystery', 'Romance', 'History', 'Biography', 'Technology', 'Science', 'Fantasy', 'Horror', 'Self-Help'];

const BookFilters = () => {
    const dispatch = useDispatch();
    const currentGenre = useSelector(state => state.books.filters.genre);

    return (
        <div className="flex items-center gap-4">
            <div className="relative">
                <select
                    value={currentGenre || 'all'}
                    onChange={(e) => dispatch(setGenre(e.target.value))}
                    className="appearance-none block w-40 sm:w-56 pl-3 pr-10 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-xl shadow-sm bg-white hover:bg-gray-50 transition-colors cursor-pointer"
                >
                    <option value="all">All Genres</option>
                    {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
            </div>
        </div>
    );
};
export default BookFilters;