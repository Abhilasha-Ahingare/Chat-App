import React, { useEffect, useState } from "react";
import ContactsContainer from "../contacts-contaier/ContactsContainer";
import { userStore } from "@/store/store";
import ChatsContsiner from "./chat-conrainer";

const MobileChatLayout = () => {
  const { selectedChatData } = userStore();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 804);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 804);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Show chat if a contact is selected, else show contacts (on mobile)
  if (isMobile) {
    return selectedChatData ? <ChatsContsiner /> : <ContactsContainer />;
  }
  // On desktop, show both as per your existing layout (or just chat area)
  return (
    <div className="flex w-full h-full">
      <ContactsContainer/>
      <ChatsContsiner/>
    </div>
  );
};

export default MobileChatLayout;
