import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { updateBook } from '../../redux/slices/booksSlice';
import { bookValidation } from '../../utils/validation';
import Input from '../common/Input';
import Button from '../common/Button';
import { cn } from '../../utils/cn';

const GENRES = ['Fiction', 'Non-Fiction', 'Sci-Fi', 'Mystery', 'Romance', 'History', 'Biography', 'Technology', 'Science', 'Fantasy', 'Horror', 'Self-Help'];

const EditBookForm = ({ book, onSuccess, onCancel }) => {
    const dispatch = useDispatch();
    const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm({
        mode: 'onChange',
        defaultValues: {
            ...book,
            // Ensure numbers are pure numbers
            publishedYear: book.publishedYear,
        }
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

        const result = await dispatch(updateBook({ id: book.id, data: formattedData }));
        if (updateBook.fulfilled.match(result)) {
            onSuccess();
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
                <h2 className="text-lg font-semibold text-gray-900">Edit Book Details</h2>
            </div>
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

                    <Input
                        label="Published Year"
                        type="number"
                        placeholder="e.g. 1925"
                        error={errors.publishedYear?.message}
                        {...register('publishedYear', bookValidation.publishedYear)}
                    />

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
                            rows={4}
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
                        {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
                    </Button>
                </div>
            </form>
        </div>
    );
};
export default EditBookForm;