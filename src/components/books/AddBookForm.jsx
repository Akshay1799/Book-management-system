import { useForm, Controller } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { addBook } from '../../redux/slices/booksSlice';
import { bookValidation } from '../../utils/validation';
import Input from '../common/Input';
import Button from '../common/Button';
import { cn } from '../../utils/cn';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const GENRES = ['Fiction', 'Non-Fiction', 'Sci-Fi', 'Mystery', 'Romance', 'History', 'Biography', 'Technology', 'Science', 'Fantasy', 'Horror', 'Self-Help'];

const AddBookForm = ({ onSuccess, onCancel }) => {
    const dispatch = useDispatch();
    const { register, handleSubmit, control, formState: { errors, isSubmitting }, watch } = useForm({
        mode: 'onChange'
    });

    const totalCopies = watch('totalCopies');

    const onSubmit = async (data) => {
        const formattedData = {
            ...data,
            publishedYear: Number(data.publishedYear),
            pages: Number(data.pages),
            availableCopies: Number(data.availableCopies),
            totalCopies: Number(data.totalCopies)
        };

        const result = await dispatch(addBook(formattedData));
        if (addBook.fulfilled.match(result)) {
            onSuccess();
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <Input
                    label="Title"
                    placeholder="e.g. The Great Gatsby"
                    error={errors.title?.message}
                    {...register('title', bookValidation.title)}
                />

                <Input
                    label="Author"
                    placeholder="e.g. F. Scott Fitzgerald"
                    error={errors.author?.message}
                    {...register('author', bookValidation.author)}
                />

                <Input
                    label="ISBN"
                    placeholder="e.g. 978-0-7432-7356-5"
                    error={errors.isbn?.message}
                    {...register('isbn', bookValidation.isbn)}
                />

                <Input
                    label="Publisher"
                    placeholder="e.g. Scribner"
                    error={errors.publisher?.message}
                    {...register('publisher', bookValidation.publisher)}
                />

                <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Published Year</label>
                    <Controller
                        control={control}
                        name="publishedYear"
                        rules={bookValidation.publishedYear}
                        render={({ field: { onChange, value, ref } }) => (
                            <DatePicker
                                selected={value ? new Date(value, 0, 1) : null}
                                onChange={(date) => onChange(date ? date.getFullYear() : '')}
                                showYearPicker
                                dateFormat="yyyy"
                                placeholderText="Select Year"
                                className={cn(
                                    'w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm outline-none transition-all',
                                    errors.publishedYear && 'border-red-300 focus:border-red-500 focus:ring-red-500'
                                )}
                                maxDate={new Date()}
                                yearItemNumber={9}
                            />
                        )}
                    />
                    {errors.publishedYear && <p className="mt-1 text-sm text-red-600">{errors.publishedYear.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
                    <select
                        className={cn(
                            "block w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg shadow-sm transition-all",
                            errors.genre ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""
                        )}
                        {...register('genre', bookValidation.genre)}
                    >
                        <option value="">Select Genre</option>
                        {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                    {errors.genre && <p className="mt-1 text-sm text-red-600">{errors.genre.message}</p>}
                </div>

                <Input
                    label="Pages"
                    type="number"
                    placeholder="e.g. 180"
                    error={errors.pages?.message}
                    {...register('pages', bookValidation.pages)}
                />

                <Input
                    label="Language"
                    placeholder="e.g. English"
                    error={errors.language?.message}
                    {...register('language', bookValidation.language)}
                />

                <div className="sm:col-span-2">
                    <Input
                        label="Cover Image URL"
                        placeholder="https://example.com/image.jpg"
                        error={errors.coverImage?.message}
                        {...register('coverImage', bookValidation.coverImage)}
                    />
                </div>

                <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Overview</label>
                    <textarea
                        rows={3}
                        className={cn(
                            "shadow-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-lg p-2.5 outline-none transition-all",
                            errors.overview ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""
                        )}
                        placeholder="Brief description of the book..."
                        {...register('overview', bookValidation.overview)}
                    />
                    {errors.overview && <p className="mt-1 text-sm text-red-600">{errors.overview.message}</p>}
                </div>

                <Input
                    label="Total Copies"
                    type="number"
                    placeholder="e.g. 10"
                    error={errors.totalCopies?.message}
                    {...register('totalCopies', bookValidation.totalCopies)}
                />

                <Input
                    label="Available Copies"
                    type="number"
                    placeholder="e.g. 5"
                    error={errors.availableCopies?.message}
                    {...register('availableCopies', {
                        ...bookValidation.availableCopies,
                        validate: (value) => {
                            if (totalCopies && Number(value) > Number(totalCopies)) {
                                return "Available copies cannot exceed total copies";
                            }
                            return true;
                        }
                    })}
                />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="secondary" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Add Book'}
                </Button>
            </div>
        </form>
    );
};
export default AddBookForm;