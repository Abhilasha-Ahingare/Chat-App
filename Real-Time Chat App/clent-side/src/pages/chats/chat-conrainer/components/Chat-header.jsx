import { getColor } from "@/lib/utils";
import { userStore } from "@/store/store";
import { HOST } from "@/utils/constants";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import React from "react";
import { RiCloseFill } from "react-icons/ri";

const ChatHeader = () => {
  const { closeChat, selectedChatType, selectedChatData } = userStore();
  // Mobile logic: if on mobile, close chat should clear selectedChatData
  const handleClose = () => {
    closeChat();
    // No-op: MobileChatLayout will handle showing contacts
  };

  return (
    <div
      className="h-[9vh] border-b border-white/10 bg-gradient-to-r from-[#133b53] to-[#041a24c5] flex items-center justify-between backdrop-blur-sm"
      style={{ padding: "18px" }}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex gap-4 items-center">
          <div className="w-13 h-13 relative group">
            <Avatar className="h-13 w-13 rounded-full overflow-hidden ring-2 ring-indigo-500/20 ring-offset-2 ring-offset-[#1a1a2e] transition-all duration-300 group-hover:ring-indigo-500/40">
              {selectedChatData.image ? (
                <AvatarImage
                  src={`${HOST}/${selectedChatData.image}`}
                  alt="profile"
                  className="object-cover w-full h-full bg-black/20 transition-transform duration-300 group-hover:scale-110 rounded-full"
                />
              ) : (
                <div
                  className={` capitalize h-12 w-12 text-lg border-2 border-white/10 flex items-center justify-center rounded-full backdrop-blur-sm  transition-all duration-300 ${getColor(
                    selectedChatData.color || ""
                  )} hover:border-indigo-500/30`}
                >
                  {selectedChatData.firstName
                    ? selectedChatData.firstName.charAt(0)
                    : selectedChatData.email.charAt(0)}
                </div>
              )}
            </Avatar>
          </div>
          <div className="flex flex-col">
            <span
              className="text-[#7d97a1] font-serif tracking-wide"
              style={{ fontSize: "20px", textTransform: "capitalize" }}
            >
              {selectedChatType === "contact" && selectedChatData.firstName
                ? `${selectedChatData.firstName ?? ""} ${
                    selectedChatData.lastName ?? ""
                  }`
                : selectedChatData.email}
            </span>
            <span className="text-sm text-gray-400">Online</span>
          </div>
        </div>
        <button
          className="text-neutral-400 hover:text-white transition-all duration-300 p-2 hover:bg-white/5 rounded-xl"
          onClick={handleClose}
          title="Close chat"
        >
          <RiCloseFill className="text-3xl" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
