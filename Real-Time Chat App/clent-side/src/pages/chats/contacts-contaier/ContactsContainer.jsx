import { useEffect } from "react";
import NewDm from "./new-dm/NewDm";
import ProfileInfo from "./profile-info/Profile-Info";
import { apiClient } from "@/lib/api-client";
import { GET_CONTACTS_DM_LIST_ROUTE } from "@/utils/constants";
import ContactList from "@/components/ui/contactList";
import { userStore } from "@/store/store";

const ContactsContainer = () => {
  const directMessageContacts = userStore(state => state.directMessageContacts);
  const setDirectMessageContacts = userStore(state => state.setDirectMessageContacts);

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
    <div className="w-full md:w-[35vw] xl:w-[20vw] bg-gradient-to-r from-[#0d2c33] to-[#213b4def] border-r border-[#2f303b] flex flex-col justify-between gap-8">
      <div className="py-6 text-center mb-8 flex items-center justify-center gap-3" style={{ marginTop: "15px" }}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
          strokeWidth="1.8" stroke="url(#grad)" className="w-8 h-8 drop-shadow-lg animate-bounce-slow">
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: "#7f53ff", stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: "#ff512f", stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h6m-6 4h3m9 0a9 9 0 11-3.6-7.2L21 6v6a9 9 0 01-3 7z" />
        </svg>
        <span className="text-2xl font-bold tracking-wide bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text select-none">
          Konvo
        </span>
      </div>

      <div className="flex-1 flex flex-col gap-4 mt-4" style={{ padding: "18px" }}>
        <div className="flex items-center justify-between mb-4">
          <SectionTitle text="Direct Messages" />
          <NewDm />
        </div>

        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden mt-12 p-6">
          <ContactList contacts={directMessageContacts} />
        </div>
      </div>

      <div className="mt-4">
        <ProfileInfo />
      </div>
    </div>
  );
};

const SectionTitle = ({ text }) => (
  <h6 className="uppercase tracking-wider text-neutral-400 text-sm font-light">
    {text}
  </h6>
);

export default ContactsContainer;
