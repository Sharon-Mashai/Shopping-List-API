import type { IncomingMessage, ServerResponse } from "http";
import type { Item } from "../types/item.js";
import { sendError } from "../utils/sendError.js";


const items: Item[] = [];

let nextId = 1;

// Get all shopping items
export const getItems = (res: ServerResponse) => {
  res.writeHead(200, {
    "Content-Type": "application/json",
  });

  res.end(JSON.stringify(items));
};

// Get one shopping item using its ID
export const getItemById = (res: ServerResponse, id: number) => {
  const item = items.find((item) => item.id === id);

  if (!item) {
    sendError(res, 404, "Item not found");
    return;
  }

  res.writeHead(200, {
    "Content-Type": "application/json",
  });

  res.end(JSON.stringify(item));
};

// Create a new shopping item
export const createItem = (req: IncomingMessage, res: ServerResponse) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    try {
      const data = JSON.parse(body);

    
      if (
        typeof data.name !== "string" ||
        data.name.trim() === "" ||
        typeof data.quantity !== "number" ||
        data.quantity <= 0
      ) {
        sendError(
          res,
          400,
          "Name must be provided and quantity must be greater than 0",
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
      sendError(res, 400, "Invalid JSON");
    }
  });
};

// Update an existing shopping item
export const updateItem = (
  req: IncomingMessage,
  res: ServerResponse,
  id: number,
) => {
  const item = items.find((item) => item.id === id);

  if (!item) {
    sendError(res, 404, "Item not found");
    return;
  }

  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    try {
      const data = JSON.parse(body);

      if (
        typeof data.name !== "string" ||
        data.name.trim() === "" ||
        typeof data.quantity !== "number" ||
        data.quantity <= 0
      ) {
        sendError(
          res,
          400,
          "Name must be provided and quantity must be greater than 0",
        );

        return;
      }

      // Update the item
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
      sendError(res, 400, "Invalid JSON");
    }
  });
};

// Delete an existing shopping item
export const deleteItem = (res: ServerResponse, id: number) => {
  const itemIndex = items.findIndex((item) => item.id === id);

  if (itemIndex === -1) {
    sendError(res, 404, "Item not found");
    return;
  }

  items.splice(itemIndex, 1);

  res.writeHead(204);
  res.end();
};
