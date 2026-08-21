// Zero-dependency Local Fullstack Node.js Server
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;
const apiHandler = require('./api/orders.js');

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.mp4': 'video/mp4',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    let pathname = parsedUrl.pathname;

    // Route /api/orders
    if (pathname === '/api/orders' || pathname.startsWith('/api/orders')) {
        let body = '';
        req.on('data', chunk => {
            body += chunk;
        });
        req.on('end', () => {
            try {
                req.body = body ? JSON.parse(body) : {};
            } catch (e) {
                req.body = body;
            }
            req.query = parsedUrl.query;

            // Mock express-like res helpers
            res.status = function(code) {
                this.statusCode = code;
                return this;
            };
            res.json = function(data) {
                this.setHeader('Content-Type', 'application/json; charset=utf-8');
                this.end(JSON.stringify(data));
                return this;
            };

            apiHandler(req, res);
        });
        return;
    }

    // Static file serving
    if (pathname === '/') {
        pathname = '/index.html';
    }

    const safeSuffix = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
    const filePath = path.join(PUBLIC_DIR, safeSuffix);

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('404 Səhifə Tapılmadı');
            return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        // Video Range Request handling
        if (ext === '.mp4' && req.headers.range) {
            const range = req.headers.range;
            const total = stats.size;
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : total - 1;
            const chunksize = (end - start) + 1;

            res.writeHead(206, {
                'Content-Range': `bytes ${start}-${end}/${total}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'video/mp4'
            });
            const stream = fs.createReadStream(filePath, { start, end });
            stream.pipe(res);
            return;
        }

        res.writeHead(200, {
            'Content-Type': contentType,
            'Content-Length': stats.size
        });
        const readStream = fs.createReadStream(filePath);
        readStream.pipe(res);
    });
});

server.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🌿 Təbii Lənkəran Çayı & Zeytun Yağı Fullstack Server`);
    console.log(`🚀 Sayt: http://localhost:${PORT}`);
    console.log(`👑 İdarəetmə Paneli: http://localhost:${PORT}/admin.html`);
    console.log(`🔌 API: http://localhost:${PORT}/api/orders`);
    console.log(`====================================================`);
});
