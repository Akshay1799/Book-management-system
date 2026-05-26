import { useEffect, useState } from 'react';
import { BOOK_COVER_FALLBACK, getBookCoverUrl } from '../../utils/bookCover.js';
import { cn } from '../../utils/cn.js';

const BookCover = ({
  book,
  className = '',
  alt,
  eager = false,
  ...props
}) => {
  const targetSrc = getBookCoverUrl(book);
  const isLocal = targetSrc === BOOK_COVER_FALLBACK;
  const [failed, setFailed] = useState(false);
  const src = failed ? BOOK_COVER_FALLBACK : targetSrc;
  const [loaded, setLoaded] = useState(isLocal);

  useEffect(() => {
    setFailed(false);
    setLoaded(isLocal);
  }, [book?.id, targetSrc, isLocal]);

  const handleLoad = () => setLoaded(true);

  const handleError = () => {
    setFailed(true);
    setLoaded(true);
  };

  return (
    <div className="relative h-full w-full overflow-hidden bg-gray-100">
      {!loaded && (
        <img
          src={BOOK_COVER_FALLBACK}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-contain p-0.5 opacity-50"
        />
      )}
      <img
        key={`${book?.id}-${src}`}
        src={src}
        alt={alt || book?.title || 'Book cover'}
        className={cn(
          className,
          'transition-opacity duration-150',
          loaded ? 'opacity-100' : 'opacity-0',
        )}
        onLoad={handleLoad}
        onError={handleError}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={eager ? 'high' : 'low'}
        {...props}
      />
    </div>
  );
};

export default BookCover;
