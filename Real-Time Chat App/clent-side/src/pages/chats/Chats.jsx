import { userStore } from "@/store/store";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ContactsContainer from "./contacts-contaier/ContactsContainer";
import EmptyContainer from "./empty-chat-container";
import ChatsContsiner from "./chat-conrainer";

const Chats = () => {
  const {
    userInfo,
    selectedChatType,
    isUploading,
    isDownloading,
    fileUploadProgress,
    fileDownloadProgress,
  } = userStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (userInfo && !userInfo.profileSetup) {
      alert("Please complete profile setup first.");
      navigate("/profile");
    }
  }, [userInfo, navigate]);

  return (
    <div className=" flex h-[100vh] w-screen text-white overflow-hidden ">
      <ContactsContainer />
      {isUploading && (
        <div className="h-[100vh] w-[100vw] fixed top-0 z-10 left-0 bg-black flex items-center justify-center">
          <h5 className="text-5xl animate-pulse">uploading file</h5>
          {fileUploadProgress}%
        </div>
      )}
      {isDownloading && (
        <div className="h-[100vh] w-[100vw] fixed top-0 z-10 left-0 bg-black flex items-center justify-center">
          <h5 className="text-5xl animate-pulse">Downloading file</h5>
          {fileDownloadProgress}
        </div>
      )}

      {selectedChatType === undefined ? <EmptyContainer /> : <ChatsContsiner />}
    </div>
  );
};

export default Chats;
