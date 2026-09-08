import http, { type IncomingMessage, type ServerResponse } from "http";
import { itemRoutes } from "./routes/itemRoutes.js";

const PORT = 4000;

const requestListener = (req: IncomingMessage, res: ServerResponse) => {
  itemRoutes(req, res);
};

const server = http.createServer(requestListener);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
