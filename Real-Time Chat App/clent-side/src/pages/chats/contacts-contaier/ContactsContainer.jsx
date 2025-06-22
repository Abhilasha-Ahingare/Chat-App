import { useEffect } from "react";
import NewDm from "./new-dm/NewDm";
import ProfileInfo from "./profile-info/Profile-Info";
import { apiClient } from "@/lib/api-client";
import { GET_CONTACTS_DM_LIST_ROUTE } from "@/utils/constants";
import ContactList from "@/components/ui/contactList";
import { userStore } from "@/store/store";
// import CreateChannel from "./CreateChannel";

const ContactsContainer = () => {
  const { directMessageContacts, setDirectMessageContacts, channels } =
    userStore();

  useEffect(() => {
    const getContacts = async () => {
      const response = await apiClient.get(GET_CONTACTS_DM_LIST_ROUTE, {
        withCredentials: true,
      });
      if (response.data.contacts) {
        setDirectMessageContacts(response.data.contacts);
      }
    };

    getContacts();
  }, []);

  return (
    <div className="w-full md:w-[35vw] xl:w-[20vw]  bg-gradient-to-r from-[#0d2c33] to-[#213b4def] border-r border-[#2f303b] flex flex-col justify-between gap-8">
      {/* Top Logo/Header */}
      <div className="py-6 text-center text-2xl text-gray-300 font-semibold tracking-wider mb-8">
        💖 Abhisha Chat
      </div>

      {/* Section - Direct Messages */}
      <div className="flex-1 flex flex-col gap-4 mt-4" style={{padding:"18px"}}>
        <div className="flex items-center justify-between mb-4">
          <SectionTitle text="Direct Messages" />
          <NewDm />
        </div>

        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden mt-12 p-6">
          <ContactList contacts={directMessageContacts} />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4">
        <ProfileInfo />
      </div>
    </div>
  );
};

// Section Title component
const SectionTitle = ({ text }) => {
  return (
    <h6 className="uppercase tracking-wider text-neutral-400 text-sm font-light">
      {text}
    </h6>
  );
};

export default ContactsContainer;
