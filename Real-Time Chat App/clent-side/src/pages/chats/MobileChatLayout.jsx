import React, { useEffect, useState } from "react";
import ContactsContainer from "../contacts-contaier/ContactsContainer";
import ChatsContsiner from "./chat-conrainer";
import { userStore } from "@/store/store";

const MobileChatLayout = () => {
  const showContacts = userStore((state) => state.showContacts);
  const selectedChatData = userStore((state) => state.selectedChatData);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth >= 500);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth >= 500);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isMobile) {
    return showContacts ? <ContactsContainer /> : <ChatsContsiner />;
  }

  return (
    <div className="flex w-full h-full">
      <ContactsContainer />
      <ChatsContsiner />
    </div>
  );
};

export default MobileChatLayout;
