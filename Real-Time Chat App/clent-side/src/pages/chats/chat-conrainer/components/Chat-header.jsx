import { getColor } from "@/lib/utils";
import { userStore } from "@/store/store";
import { HOST } from "@/utils/constants";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import React, { useState } from "react";
import { RiCloseFill } from "react-icons/ri";
import { IoCloseSharp } from "react-icons/io5";

const ChatHeader = () => {
  const { closeChat, selectedChatType, selectedChatData } = userStore();
  const [showProfileImage, setShowProfileImage] = useState(false);

  const handleClose = () => {
    closeChat();
  };

  return (
    <>
      <div
        className="h-[9vh] border-b border-white/10 bg-gradient-to-r from-[#133b53] to-[#041a24c5] flex items-center justify-between backdrop-blur-sm"
        style={{ padding: "18px" }}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex gap-4 items-center">
            <div className="w-13 h-13 relative group">
              <Avatar
                className="h-13 w-13 rounded-full overflow-hidden ring-2 ring-indigo-500/20 ring-offset-2 ring-offset-[#1a1a2e] transition-all duration-300 group-hover:ring-indigo-500/40"
                onClick={() => {
                  if (selectedChatData.image) setShowProfileImage(true);
                }}
                style={{ cursor: selectedChatData.image ? "pointer" : "default" }}
              >
                {selectedChatData.image ? (
                  <AvatarImage
                    src={`${HOST}/${selectedChatData.image}`}
                    alt="profile"
                    className="object-cover w-full h-full bg-black/20 transition-transform duration-300 group-hover:scale-110 rounded-full"
                  />
                ) : (
                  <div
                    className={` capitalize h-12 w-12 text-lg border-2 border-white/10 flex items-center justify-center rounded-full backdrop-blur-sm transition-all duration-300 ${getColor(
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

      {/* Modal for image preview */}
      {showProfileImage && (
        <div className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative max-w-7xl mx-auto p-4 w-full flex flex-col items-center justify-center">
            <button
              className="absolute top-0 right-8 bg-white/10 hover:bg-white/20 p-3 text-2xl rounded-xl cursor-pointer transition-all duration-300 text-white/90 backdrop-blur-sm"
              onClick={() => setShowProfileImage(false)}
              title="Close preview"
            >
              <IoCloseSharp />
            </button>
            <img
              src={`${HOST}/${selectedChatData.image}`}
              alt="Profile Preview"
              className="max-h-[85vh] w-auto max-w-full mx-auto rounded-xl shadow-2xl animate-scaleIn object-contain border-2 border-black/60"
              style={{ boxShadow: "0 0 0 1px rgba(0,0,0,0.2)" }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ChatHeader;
