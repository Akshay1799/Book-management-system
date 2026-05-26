// server.js for Vercel
import jsonServer from 'json-server';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const server = jsonServer.create();
const middlewares = jsonServer.defaults();

// In Vercel, we can't write to the file system, so we load the data in memory
// or simply point to the file (which will be read-only in effect).
const dbString = fs.readFileSync(path.join(__dirname, '../db.json'), 'utf-8');
const db = JSON.parse(dbString);
const router = jsonServer.router(db);

server.use(middlewares);
server.use(jsonServer.rewriter({
  '/api/*': '/$1',
}))
server.use(router);

export default (req, res) => {
  server(req, res);
};
