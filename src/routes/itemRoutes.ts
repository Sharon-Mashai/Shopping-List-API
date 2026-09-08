import type { IncomingMessage, ServerResponse } from "http";
import { getItems, getItemById, createItem, updateItem, deleteItem,} from "../controllers/itemController.js";

export const itemRoutes = (req: IncomingMessage, res: ServerResponse) => {
  // GET /items
  if (req.method === "GET" && req.url === "/items") {
    getItems(res);
    return;
  }

  // POST /items
  if (req.method === "POST" && req.url === "/items") {
    createItem(req, res);
    return;
  }

 
  if (req.url?.startsWith("/items/")) {
    const id = Number(req.url.split("/")[2]);

    // GET /items
    if (req.method === "GET") {
      getItemById(res, id);
      return;
    }

    // PUT /items
    if (req.method === "PUT") {
      updateItem(req, res, id);
      return;
    }

    // DELETE /items
    if (req.method === "DELETE") {
      deleteItem(res, id);
      return;
    }
  }

  // Route not found
  res.writeHead(404, {
    "Content-Type": "application/json",
  });

  res.end(
    JSON.stringify({
      error: {
        status: 404,
        message: "Route not found",
      },
    }),
  );
};
