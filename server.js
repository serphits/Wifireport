const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    // Serve index.html for root path
    let filePath = req.url === '/' ? './index.html' : `.${req.url}`;
    
    // Resolve to absolute path
    filePath = path.resolve(__dirname, filePath);
    
    // Prevent directory traversal attacks
    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }
    
    // Get file extension
    const extname = String(path.extname(filePath)).toLowerCase();
    
    const mimeTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'text/javascript',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.json': 'application/json'
    };
    
    const contentType = mimeTypes[extname] || 'application/octet-stream';
    
    // Try to read and serve the file
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                // If file not found, try serving index.html (for SPA routing)
                fs.readFile(path.resolve(__dirname, 'index.html'), (err, data) => {
                    if (err) {
                        res.writeHead(404);
                        res.end('File not found');
                        return;
                    }
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(data);
                });
            } else {
                res.writeHead(500);
                res.end(`Server error: ${error}`);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
});

server.listen(PORT, () => {
    console.log(`WiFi.Report server running at http://localhost:${PORT}`);
});
