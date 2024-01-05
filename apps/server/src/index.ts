import http from "http";
import SocketService from "./service/socket";
async function init() {
  const socketService = new SocketService();
  const httpServer = http.createServer();

  const PORT = process.env.PORT ? process.env.PORT : 8000;
  socketService.io.attach(httpServer); // socket Io attach to http server

  httpServer.listen(PORT, () => {
    console.log(`HTTP server started at PORT:${PORT}`);
  });
  socketService.initListeners();
}

init();
// console.log("Hello World");
