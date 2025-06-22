import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { io } from "socket.io-client";
import { HOST } from "@/utils/constants";
import { userStore } from "@/store/store";

export const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socketInstance, setSocketInstance] = useState(null);
  const { userInfo } = userStore();

  useEffect(() => {
    if (userInfo) {
      const socket = io(HOST, {
        withCredentials: true,
        query: { userId: userInfo.id },
      });

      socket.on("connect", () => {
        console.log("✅ connected to socket.io server");
      });

      socket.on("receiveMessage", (message) => {
        const { selectedChatData, selectedChatType, addMessage } =
          userStore.getState();

        if (
          (selectedChatType !== undefined &&
            selectedChatData._id === message.sender._id) ||
          selectedChatData._id === message.recipient._id
        ) {
          addMessage(message);
        }
      });

      setSocketInstance(socket);

      return () => {
        socket.disconnect();
        setSocketInstance(null);
      };
    }
  }, [userInfo]);

  return (
    <SocketContext.Provider value={socketInstance}>
      {children}
    </SocketContext.Provider>
  );
};
