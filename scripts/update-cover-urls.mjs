import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '../src/db.json');

function normalizeIsbn(isbn) {
  return isbn.replace(/[^0-9X]/gi, '');
}

function pickGoogleCover(links) {
  if (!links) return null;
  const raw = links.extraLarge || links.large || links.medium || links.thumbnail || links.smallThumbnail;
  if (!raw) return null;
  return raw.replace(/^http:/, 'https:').replace(/&edge=curl/g, '');
}

async function fetchGoogleCover(isbn) {
  const clean = normalizeIsbn(isbn);
  const res = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=isbn:${clean}`,
    { signal: AbortSignal.timeout(10000) },
  );
  if (!res.ok) return null;
  const data = await res.json();
  return pickGoogleCover(data.items?.[0]?.volumeInfo?.imageLinks);
}

function openLibraryCover(isbn, size = 'M') {
  const clean = normalizeIsbn(isbn);
  return `https://covers.openlibrary.org/b/isbn/${clean}-${size}.jpg`;
}

async function resolveCover(book) {
  const google = await fetchGoogleCover(book.isbn);
  if (google) return { url: google, source: 'google' };

  return { url: openLibraryCover(book.isbn, 'M'), source: 'openlibrary' };
}

const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const results = await Promise.all(
  db.books.map(async (book) => {
    const { url, source } = await resolveCover(book);
    book.coverImage = url;
    return { id: book.id, title: book.title, source, url };
  }),
);

fs.writeFileSync(dbPath, `${JSON.stringify(db, null, 2)}\n`);
console.log(JSON.stringify(results, null, 2));
