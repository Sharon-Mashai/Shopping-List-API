import http, { type IncomingMessage, type ServerResponse } from "http";
import type { Item } from "./models/item.js";

const PORT = 3000;
const items: Item[] = [];
let nextId = 1;

const requestListener = (req: IncomingMessage, res: ServerResponse) => {
  // GET /items
  if (req.method === "GET" && req.url === "/items") {
    res.writeHead(200, {
      "Content-Type": "application/json",
    });

    res.end(JSON.stringify(items));
    return;
  }

  // GET /items by id
  if (req.method === "GET" && req.url?.startsWith("/items/")) {
    const id = Number(req.url.split("/")[2]);

    const item = items.find((item) => item.id === id);

    if (!item) {
      res.writeHead(404, {
        "Content-Type": "application/json",
      });

      res.end(
        JSON.stringify({
          message: "Item not found",
        }),
      );

      return;
    }

    res.writeHead(200, {
      "Content-Type": "application/json",
    });

    res.end(JSON.stringify(item));
    return;
  }

  // PUT /items by id
if (req.method === "PUT" && req.url?.startsWith("/items/")) {
  const id = Number(req.url.split("/")[2]);

  const item = items.find((item) => item.id === id);

  if (!item) {
    res.writeHead(404, {
      "Content-Type": "application/json",
    });

    res.end(
      JSON.stringify({
        message: "Item not found",
      }),
    );

    return;
  }

  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    try {
      const data = JSON.parse(body);

      if (!data.name || !data.quantity) {
        res.writeHead(400, {
          "Content-Type": "application/json",
        });

        res.end(
          JSON.stringify({
            message: "Name and quantity are required",
          }),
        );

        return;
      }

      item.name = data.name;
      item.quantity = data.quantity;

      if (typeof data.purchased === "boolean") {
        item.purchased = data.purchased;
      }

      res.writeHead(200, {
        "Content-Type": "application/json",
      });

      res.end(JSON.stringify(item));
    } catch {
      res.writeHead(400, {
        "Content-Type": "application/json",
      });

      res.end(
        JSON.stringify({
          message: "Invalid JSON",
        }),
      );
    }
  });

  return;
}

  // POST /items
  if (req.method === "POST" && req.url === "/items") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        const data = JSON.parse(body);

        if (!data.name || !data.quantity) {
          res.writeHead(400, {
            "Content-Type": "application/json",
          });

          res.end(
            JSON.stringify({
              message: "Name and quantity are required",
            }),
          );

          return;
        }

        const newItem: Item = {
          id: nextId,
          name: data.name,
          quantity: data.quantity,
          purchased: false,
        };

        nextId++;

        items.push(newItem);

        res.writeHead(201, {
          "Content-Type": "application/json",
        });

        res.end(JSON.stringify(newItem));
      } catch {
        res.writeHead(400, {
          "Content-Type": "application/json",
        });

        res.end(
          JSON.stringify({
            message: "Invalid JSON",
          }),
        );
      }
    });

    return;
  }

  // Route not found
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
