// server.js for Vercel
import jsonServer from 'json-server';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = jsonServer.create();
const middlewares = jsonServer.defaults();

const dbString = fs.readFileSync(path.join(process.cwd(), 'db.json'), 'utf-8');
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
