import { useSocket } from "@/context/SocketContext";
import { apiClient } from "@/lib/api-client";
import { userStore } from "@/store/store";
import { UPLOADS_FILE_ROUTE } from "@/utils/constants";
import EmojiPicker from "emoji-picker-react";
import React, { useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { IoSend } from "react-icons/io5";
import { RiEmojiStickerLine } from "react-icons/ri";

const MessageBar = () => {
  const socket = useSocket();
  const {
    selectedChatType,
    selectedChatData,
    userInfo,
    setIsUploading,
    setFileUploadProgess,
  } = userStore();

  const [message, setMessage] = useState("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

  const emojiRef = useRef();
  const fileInputRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmojiPickerOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddEmoji = (emoji) => {
    setMessage((prev) => prev + emoji.emoji);
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    if (selectedChatType === "contact") {
      socket.emit("sendMessage", {
        sender: userInfo.id,
        content: message.trim(),
        recipient: selectedChatData._id,
        messageType: "text",
        fileUrl: null,
      });
      setMessage("");
    }
  };

  const handleAttachmentClick = () => fileInputRef.current?.click();

  const handleAttachment = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);
      setIsUploading(true);
      const response = await apiClient.post(UPLOADS_FILE_ROUTE, formData, {
        withCredentials: true,
        onUploadProgress: (data) => {
          setFileUploadProgess(Math.round((100 * data.loaded) / data.total));
        },
      });

      // --- changed: add null check and better error handling ---
      if (response && response.status === 200 && response.data?.filePath) {
        setIsUploading(false);
        if (selectedChatType === "contact") {
          socket.emit("sendMessage", {
            sender: userInfo.id,
            content: undefined,
            recipient: selectedChatData._id,
            messageType: "file",
            fileUrl: response.data.filePath,
          });
        }
      } else {
        console.error("Unexpected response:", response);
        alert("File upload failed. Please try again.");
        setIsUploading(false);
      }
      // --- end changed section ---
    } catch (error) {
      setIsUploading(false);
      console.error("Error uploading file:", error);
      alert(
        "An error occurred while uploading the file. Please check the server logs."
      );
    }
  };
  return (
    <div className="h-[10vh] bg-gradient-to-r from-[#061218] to-[#0b2130] flex items-center px-2 sm:px-4 md:px-8 border-t border-opacity-10 border-white/10 backdrop-blur-sm">
      <div className="flex items-center w-full bg-white/5 rounded-2xl px-3 sm:px-5 md:px-8 py-2 sm:py-3 gap-2 sm:gap-4 relative shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-md" style={{margin:"10px"}}>
        <input
          type="text"
          className="flex-1 bg-transparent text-white placeholder:text-gray-400 focus:outline-none text-[15px] rounded-xl border border-transparent focus:border-indigo-500/30 transition-all duration-300 h-[5vh] px-3 sm:px-4 py-2 sm:py-2 font-light tracking-wide min-w-0"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button
          className="text-gray-400 hover:text-indigo-400 transition-all duration-300 p-2 sm:p-2.5 hover:bg-white/5 rounded-xl flex items-center justify-center"
          onClick={handleAttachmentClick}
          title="Attach file"
        >
          <GrAttachment className="text-xl sm:text-2xl transform hover:scale-110 transition-transform" />
        </button>
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleAttachment}
        />
        <button
          className="text-gray-400 hover:text-indigo-400 transition-all duration-300 p-2 sm:p-2.5 hover:bg-white/5 rounded-xl flex items-center justify-center"
          onClick={() => setEmojiPickerOpen(true)}
          title="Add emoji"
        >
          <RiEmojiStickerLine className="text-xl sm:text-2xl transform hover:scale-110 transition-transform" />
        </button>
        {emojiPickerOpen && (
          <div
            className="absolute bottom-16 right-0 z-10 animate-fadeIn"
            ref={emojiRef}
          >
            <div className="p-2 bg-[#1a1a2e]/95 rounded-xl shadow-2xl backdrop-blur-lg border border-white/10">
              <EmojiPicker
                theme="dark"
                open={emojiPickerOpen}
                onEmojiClick={handleAddEmoji}
                autoFocusSearch={false}
              />
            </div>
          </div>
        )}
        <button
          className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full p-3 sm:p-3.5 flex items-center justify-center hover:from-indigo-500 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-indigo-500/25 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-[#1a1a2e]"
          onClick={handleSendMessage}
          style={{ minWidth: "44px", minHeight: "44px" }}
        >
          <IoSend className="text-xl sm:text-2xl text-white" />
        </button>
      </div>
    </div>
  );
};

export default MessageBar;
