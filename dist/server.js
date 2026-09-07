import http, { IncomingMessage, ServerResponse, } from "http";
const PORT = 3000;
const requestListener = (req, res) => {
    res.writeHead(200, {
        "Content-Type": "application/json",
    });
    res.end(JSON.stringify({
        message: "Shopping List API is running",
    }));
};
const server = http.createServer(requestListener);
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map