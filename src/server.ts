import http, { type IncomingMessage, type ServerResponse } from "http";
import type { Item } from "./models/item.js";

const PORT = 3000;

const items: Item[] = [];

const requestListener = (req: IncomingMessage, res: ServerResponse) => {
  if (req.method === "GET" && req.url === "/items") {
    res.writeHead(200, {
      "Content-Type": "application/json",
    });

    res.end(JSON.stringify(items));

  
    return;
  }

  res.writeHead(404, {
    "Content-Type": "application/json",
  });

  res.end(
    JSON.stringify({
      message: "Route not found",
    }),
  );
};

const server = http.createServer(requestListener);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
