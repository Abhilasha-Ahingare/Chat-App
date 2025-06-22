const { Server: SocketIoServer } = require("socket.io");
const MessageModel = require("./models/messageModel");

let io;

const SetupSocket = (server) => {
  io = new SocketIoServer(server, {
    cors: {
      origin: process.env.ORIGIN,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      credentials: true,
    },
  });

  const userSocketMap = new Map();

  const disconnect = (socket) => {
    for (const [userId, socketId] of userSocketMap) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
  };

  const sendMessage = async (msgData) => {
    const senderSocketId = userSocketMap.get(msgData.sender);
    const recipientSocketId = userSocketMap.get(msgData.recipient);

    const createdMessage = await MessageModel.create(msgData);

    const messageData = await MessageModel
      .findById(createdMessage._id)
      .populate("sender", "id firstName lastName email image color") 
      .populate("recipient", "id firstName lastName email image color"); 

    if (recipientSocketId) {
      io.to(recipientSocketId).emit("receiveMessage", messageData);
    }

    if (senderSocketId) {
      io.to(senderSocketId).emit("receiveMessage", messageData);
    }
  };

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
      userSocketMap.set(userId, socket.id);
    } else {
      console.log("⚠️ User ID not provided during connection");
    }

    socket.on("sendMessage", sendMessage);

    socket.on("disconnect", () => disconnect(socket));
  });
};

module.exports = { SetupSocket };
