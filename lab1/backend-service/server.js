const http = require('http');
const url = require('url');

const PORT = 5000;

const handlers = {};

handlers.status = (data, callback) => {
  const metrics = {
    cpu: process.cpuUsage(),
    memory: process.memoryUsage()
  }
  callback(200, metrics);
};

handlers.notFound = (data, callback) => {
  callback(404);
};

const router = {
  'status': handlers.status
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);  
  const path = parsedUrl.pathname.replace(/^\/+|\/+$/, '');
  const queryStringObject = parsedUrl.query;
  const method = req.method.toUpperCase();
  const headers = req.headers;
  console.log(path);
  const matchingHandler = typeof(router[path]) !== 'undefined' ? router[path] : handlers.notFound;
    const data = {
      path,
      queryStringObject,
      method,
      headers
    };
    matchingHandler(data, (statusCode, payload) => {
      payload = JSON.stringify(payload);
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);      
      res.end(payload);
      console.log(`Returning response: ${statusCode} ${payload}`); 
    });
});

server.listen(PORT, () => {
  console.log(`Backend service is up on port ${PORT}`);
});