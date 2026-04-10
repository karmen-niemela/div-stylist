import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import zlib from 'zlib';
import { PostHog } from 'posthog-node';
import { promisify } from 'util';

const gzip = promisify(zlib.gzip);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const posthog = new PostHog(process.env.POSTHOG_API_KEY, {
  host: process.env.POSTHOG_HOST,
  enableExceptionAutocapture: true,
});


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
  const distinctId = req.headers['x-posthog-distinct-id'] || req.socket.remoteAddress || 'anonymous';

  let data;
  try {
    data = await fs.readFile(filePath);
  } catch (err) {
    // Log exception with PostHog for missing file
    posthog.captureException(err, distinctId, {
      $current_url: req.url,
      path: urlPath,
    });
    await posthog.flushAsync();
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

    if (urlPath === '/index.html') {
      posthog.capture({
        distinctId,
        event: 'page_viewed',
        properties: {
          $current_url: req.url,
          $referrer: req.headers['referer'] || '',
          $user_agent: req.headers['user-agent'] || '',
          ...(req.headers['x-posthog-session-id'] && { $session_id: req.headers['x-posthog-session-id'] }),
        },
      });
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

  await posthog.flushAsync();
}
