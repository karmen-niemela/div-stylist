import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import zlib from 'zlib';
import { promisify } from 'util';

const gzip = promisify(zlib.gzip);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.ico':  'image/x-icon',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.svg':  'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
};

const SECURITY_HEADERS = {
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
};

export default async function handler(req, res) {
  const urlPath = req.url === '/' ? '/index.html' : req.url;
  const filePath = path.join(__dirname, urlPath);
  const ext = path.extname(filePath);
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  let data;
  try {
    data = await fs.readFile(filePath);
  } catch {
    try {
      const fallback = await fs.readFile(path.join(__dirname, 'index.html'));
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', ...SECURITY_HEADERS });
      res.end(fallback);
    } catch {
      res.writeHead(404);
      res.end('Not found');
    }
    return;
  }

  const acceptEncoding = req.headers['accept-encoding'] || '';
  const headers = {
    'Content-Type': contentType,
    'Cache-Control': 'public, max-age=86400',
    ...SECURITY_HEADERS,
  };

  if (acceptEncoding.includes('gzip') && (ext === '.html' || ext === '.css' || ext === '.js')) {
    try {
      const compressed = await gzip(data);
      res.writeHead(200, { ...headers, 'Content-Encoding': 'gzip' });
      res.end(compressed);
    } catch {
      res.writeHead(200, headers);
      res.end(data);
    }
  } else {
    res.writeHead(200, headers);
    res.end(data);
  }
}
