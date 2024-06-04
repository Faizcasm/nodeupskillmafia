const http = require('http');
const fs = require('fs').promises;
const path = require('path');

const PORT = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {
  const { url, method } = req;
  let filePath = path.join(__dirname, 'public', url === '/' ? 'home.html' : `${url}.html`);
  
  try {
    const data = await fs.readFile(filePath);
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // File not found, serve 404 page
      const notFoundPage = await fs.readFile(path.join(__dirname, 'public', '404.html'));
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end(notFoundPage);
    } else {
      // Other error, serve 500 page
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('500 Internal Server Error');
    }
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
