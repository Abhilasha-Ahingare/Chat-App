import { apiClient } from "@/lib/api-client";
import { userStore } from "@/store/store";
import { GET_MESSAGES_ROUTE } from "@/utils/constants";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { MdFolderZip } from "react-icons/md";
import { IoMdArrowRoundDown } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";

const HOST = import.meta.env.VITE_SERVER_URL;

const MessagesContainer = () => {
  const scrollRef = useRef();
  const {
    selectedChatType,
    selectedChatData,
    userInfo,
    selectedChatMessages,
    SetSelectedChatMessages,
    setFileDownloadProgess,
    setIsDownloading,
  } = userStore();

  const [showImage, setImage] = useState(false);
  const [imageURL, setImageURL] = useState(null);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await apiClient.post(
          GET_MESSAGES_ROUTE,
          { id: selectedChatData._id },
          { withCredentials: true }
        );
        if (response.data.messages) {
          SetSelectedChatMessages(response.data.messages);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (selectedChatData._id) {
      if (selectedChatType === "contact") getMessages();
    }
  }, [selectedChatData, selectedChatType, SetSelectedChatMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  let lastDate = null;

  const checkIfImage = (filePath) => {
    const imageRegex =
      /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
    return imageRegex.test(filePath);
  };

  const renderMessage = () => {
    lastDate = null; // Reset lastDate for each render
    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timeStamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;

      return (
        <div key={index}>
          {showDate && (
            <div className="flex items-center justify-center gap-4 my-8 mt-4">
              <div
                className="px-4 py-2 rounded-full bg-white/5 md:text-xl text-gray-400 font-semibold backdrop-blur-sm"
                style={{ padding: "5px", marginTop: "15px", fontSize: "15px" }}
              >
                {moment(message.timeStamp).format("LL")}
              </div>
            </div>
          )}
          {selectedChatType === "contact" && renderDMMessage(message)}
        </div>
      );
    });
  };

  const downloadfile = async (url) => {
    setIsDownloading(true);
    setFileDownloadProgess(0);
    const response = await apiClient.get(`${HOST}/${url}`, {
      responseType: "blob",
      onDownloadProgress: (ProgressEvent) => {
        const { loaded, total } = ProgressEvent;
        const percentCompleted = Math.round((loaded * 100) / total);
        setFileDownloadProgess(percentCompleted);
      },
    });

    const urlaBlob = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = urlaBlob;
    link.setAttribute("download", url.split("/").pop());
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(urlaBlob);
    setIsDownloading(false);
    setFileDownloadProgess(0);
  };

  const renderDMMessage = (message) => {
    const isSenderMe =
      message.sender === userInfo?.id || message.sender?.id === userInfo?.id;

    return (
      <div
        className={`w-full flex ${
          isSenderMe ? "justify-end" : "justify-start"
        } mb-2 px-1 md:px-2 lg:px-4`}
      >
        <div
          className={`flex flex-col ${
            isSenderMe ? "items-end" : "items-start"
          } max-w-[100%] md:max-w-[80%] lg:max-w-[70%]`}
        >
          <div
            className={`p-5  md:p-9 rounded-2xl text-center text-base md:text-lg break-words shadow-lg backdrop-blur-sm  ${
              isSenderMe
                ? "bg-gradient-to-r from-indigo-900 to-blue-800 text-white rounded-br-none transform hover:scale-[1.02] transition-all duration-300"
                : " bg-[#2c57a8] text-white/90 rounded-bl-none border border-white/10 transform hover:scale-[1.02] transition-all duration-300"
            }`}
            style={{ minWidth: "80px", padding: "9px", margin: "6px" }}
          >
            {message.messageType === "text" && <div>{message.content}</div>}
            {message.messageType === "file" && (
              <div className="cursor-pointer">
                {checkIfImage(message.fileUrl) ? (
                  <img
                    src={`${HOST}/${message.fileUrl}`}
                    alt="sent file"
                    className="max-h-[300px] w-[300px] rounded-md border-2 border-black/80 hover:border-black/80 transition-all duration-300 mx-auto block"
                    style={{
                      boxShadow: "0 0 0 2px rgba(0,0,0,0.2)",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setImage(true);
                      setImageURL(message.fileUrl);
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-between gap-4 bg-black/20 p-3 rounded-xl backdrop-blur-sm hover:bg-black/30 transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <span className="text-white/90 text-3xl bg-white/5 rounded-xl p-3 shadow-lg">
                        <MdFolderZip />
                      </span>
                      <span className="font-medium truncate max-w-[150px]">
                        {message.fileUrl.split("/").pop()}
                      </span>
                    </div>
                    <button
                      className="bg-indigo-500/20 hover:bg-indigo-500/40 p-3 text-2xl rounded-xl cursor-pointer transition-all duration-300 text-white/90"
                      onClick={() => downloadfile(message.fileUrl)}
                      title="Download file"
                    >
                      <IoMdArrowRoundDown />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="text-[11px] text-gray-400 mt-1 pr-2 font-medium opacity-80">
            {moment(message.timeStamp).format("LT")}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto p-2 sm:p-4 md:px-8 lg:px-16 w-full scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent hover:scrollbar-thumb-white/20">
      <div className="max-w-8xl mx-auto w-full" style={{ padding: "20px" }}>
        {renderMessage()}
        <div ref={scrollRef} className="h-4" />
      </div>
      {showImage && (
        <div className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative max-w-7xl mx-auto p-4 w-full flex flex-col items-center justify-center">
            <div className="absolute top-0 right-8 flex gap-3 z-10">
              <button
                className="bg-white/10 hover:bg-white/20 p-3 text-2xl rounded-xl cursor-pointer transition-all duration-300 text-white/90 backdrop-blur-sm"
                onClick={() => downloadfile(imageURL)}
                title="Download image"
              >
                <IoMdArrowRoundDown />
              </button>
              <button
                className="bg-white/10 hover:bg-white/20 p-3 text-2xl rounded-xl cursor-pointer transition-all duration-300 text-white/90 backdrop-blur-sm"
                onClick={() => {
                  setImage(false);
                  setImageURL(null);
                }}
                title="Close preview"
              >
                <IoCloseSharp />
              </button>
            </div>
            <div className="flex items-center justify-center w-full h-full">
              <img
                src={`${HOST}/${imageURL}`}
                alt="Preview"
                className="max-h-[85vh] w-auto max-w-full mx-auto rounded-xl shadow-2xl animate-scaleIn object-contain border-2 border-black/60"
                style={{ boxShadow: "0 0 0 1px rgba(0,0,0,0.2)" }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesContainer;
