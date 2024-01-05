import { Server } from "socket.io";

import { Redis } from "ioredis";

// We need two component oen is publisher and another is subscriber
const pub = new Redis({
  host: "redis-3cf968b9-supradipdey1-3c2f.a.aivencloud.com",
  port: 18880,
  username: "default",
  password: "AVNS_hnlze_81ZA5133hFwpj",
});
const sub = new Redis({
  host: "redis-3cf968b9-supradipdey1-3c2f.a.aivencloud.com",
  port: 18880,
  username: "default",
  password: "AVNS_hnlze_81ZA5133hFwpj",
});
class SocketService {
  private _io: Server; // Instance valriable of class
  constructor() {
    console.log("Socket server init");
    this._io = new Server({
      cors: {
        allowedHeaders: ["*"],
        origin: "*",
        // Allow everything
      },
    }); // socketIo server
    sub.subscribe("MESSAGES");
  }

  // Listen event
  public initListeners() {
    const io = this.io;
    console.log("INttialize socket listeners");
    io.on("connect", (socket) => {
      console.log(`New Socket Connected`, socket.id);
      socket.on("event:message", async ({ message }: { message: string }) => {
        console.log("New Message Rec.", message);
        // publish this message to redis
        await pub.publish("MESSAGES", JSON.stringify({ message }));
      });
    });

    sub.on("message", async (channel, message) => {
      if (channel === "MESSAGES") {
        console.log("new message from redis", message);
        io.emit("message", message);
        // await produceMessage(message);
        // console.log("Message Produced to Kafka Broker");
      }
    });
  }

  get io() {
    return this._io;
  }
}

export default SocketService;
