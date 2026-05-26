import { cn } from '../../utils/cn';

const Loader = ({ className, size = 'md' }) => {
    const sizes = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
    };

    return (
        <div className={cn("flex justify-center items-center py-4", className)}>
            <div
                className={cn(
                    "animate-spin rounded-full border-t-2 border-b-2 border-indigo-600",
                    sizes[size]
                )}
            ></div>
        </div>
    );
};

export default Loader;