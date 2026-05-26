export const BOOK_COVER_FALLBACK = '/book.svg';

const INVALID_COVER_HOSTS = ['images.example.com', 'via.placeholder.com', 'placeholder.com'];

export function isInvalidCoverUrl(url) {
  if (!url?.trim()) return true;
  if (url.startsWith('/covers/')) return true;
  try {
    const { hostname } = new URL(url);
    return INVALID_COVER_HOSTS.some((host) => hostname.includes(host));
  } catch {
    return true;
  }
}

export function getBookCoverUrl(book) {
  const coverImage = book?.coverImage?.trim();

  if (coverImage && !isInvalidCoverUrl(coverImage)) {
    return coverImage;
  }

  return BOOK_COVER_FALLBACK;
}
