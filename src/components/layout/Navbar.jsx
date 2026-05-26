import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setSearch } from '../../redux/slices/bookSlices.js';
import useDebounce from '../../hooks/useDebounce';
import Button from '../common/Button';
import { IoAdd, IoSearch } from 'react-icons/io5';
import { LuLibraryBig } from "react-icons/lu";

const Navbar = ({ onAddClick }) => {
    const dispatch = useDispatch();
    const location = useLocation();
    const isHomePage = location.pathname === '/';

    const currentSearch = useSelector(state => state.books.filters.search);
    const [localSearch, setLocalSearch] = useState(currentSearch || '');
    const debouncedSearch = useDebounce(localSearch, 500);

    useEffect(() => {
        // Only dispatch search if on homepage and value changed
        if (isHomePage) {
            dispatch(setSearch(debouncedSearch));
        }
    }, [debouncedSearch, dispatch, isHomePage]);



    return (
        <nav className=" shadow-sm sticky top-0 z-40 border-b border-gray-100/50 backdrop-blur-md bg-white/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className=" flex items-center gap-2 group">
                            <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform">
                                <LuLibraryBig  size={24} />
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-gray-900 to-gray-600 tracking-tight">
                                Book Store
                            </span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        {isHomePage && (
                            <div className="relative hidden sm:block w-64 lg:w-96">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <IoSearch className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search by title, author, or ISBN..."
                                    className="block w-full pl-10 pr-3 py-2 border border-indigo-200 rounded-xl leading-5 bg-gray-50/50 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:text-sm transition-all duration-200"
                                    value={localSearch}
                                    onChange={(e) => setLocalSearch(e.target.value)}
                                />
                            </div>
                        )}

                        {isHomePage && (
                            <Button
                                onClick={onAddClick}
                                className="bg-indigo-600 gap-2 shadow-indigo-100 shadow-lg hover:shadow-indigo-200 hover:-translate-y-0.5 transition-all"
                            >
                                <IoAdd size={20} />
                                <span className=" hidden sm:inline">Add Book</span>
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;