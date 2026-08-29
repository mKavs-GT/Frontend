const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.FRONTEND_PORT || 5500;
const PUBLIC_DIR = path.resolve(__dirname, 'frontend');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.pdf': 'application/pdf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf'
};

const rewrites = {
  '/': '/index.html',
  '/home': '/index.html',
  '/Home': '/index.html',
  '/about': '/about/index.html',
  '/About': '/about/index.html',
  '/works': '/works-build/index.dev.html',
  '/Works': '/works-build/index.dev.html',
  '/branding': '/branding/index.html',
  '/Branding': '/branding/index.html',
  '/pricing': '/pricingpage/index.html',
  '/Pricing': '/pricingpage/index.html',
  '/bookus': '/loginpg/index.html',
  '/BookUs': '/loginpg/index.html',
  '/consult': '/consult/index.html',
  '/Consult': '/consult/index.html',
  '/support': '/support/index.html',
  '/Support': '/support/index.html',
  '/login': '/loginpg/index.html',
  '/Login': '/loginpg/index.html',
  '/profile': '/profile/index.html',
  '/Profile': '/profile/index.html',
  '/signup': '/signpg/index.html',
  '/SignUp': '/signpg/index.html'
};

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  let reqPath = decodeURI(req.url.split('?')[0]);

  // Check rewrites
  if (rewrites[reqPath]) {
    reqPath = rewrites[reqPath];
  }

  let filePath = path.join(PUBLIC_DIR, reqPath);

  // If path is a directory, look for index.html or index.dev.html
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    if (fs.existsSync(path.join(filePath, 'index.html'))) {
      filePath = path.join(filePath, 'index.html');
    } else if (fs.existsSync(path.join(filePath, 'index.dev.html'))) {
      filePath = path.join(filePath, 'index.dev.html');
    }
  }

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>404 Not Found</h1><p>Resource not found on localhost dev server.</p>');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  res.writeHead(200, { 'Content-Type': contentType });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\x1b[32m✓ Frontend Website running at:\x1b[0m http://localhost:${PORT}/Home`);
  console.log(`  - Clean URLs: /Home, /About, /Works, /Branding, /Pricing, /BookUs, /Support, /Profile, /SignUp`);
  console.log(`  - Portfolio sites: /Portfolio/*`);
});
