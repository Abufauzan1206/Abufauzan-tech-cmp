const http = require("http");
const fs = require("fs");
const path = require("path");

const types = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml"
};

http.createServer((req, res) => {
  let requestPath = req.url.split("?")[0];

  if (requestPath === "/") {
    requestPath = "/index.html";
  }

  const filePath = path.join(process.cwd(), requestPath);

  fs.stat(filePath, (error, stats) => {
    if (error || !stats.isFile()) {
      res.writeHead(404);
      res.end("Not Found");
      return;
    }

    const extension = path.extname(filePath);

    res.writeHead(200, {
      "Content-Type": types[extension] || "application/octet-stream"
    });

    fs.createReadStream(filePath).pipe(res);
  });
}).listen(8080, "127.0.0.1", () => {
  console.log("CMP SERVER: http://127.0.0.1:8080");
});
