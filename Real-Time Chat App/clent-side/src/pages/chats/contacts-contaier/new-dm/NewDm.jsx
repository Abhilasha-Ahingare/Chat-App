import React, { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaPlus } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { apiClient } from "@/lib/api-client";
import { HOST, SEARCH_CONTACTS_ROUTE } from "@/utils/constants";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { getColor } from "@/lib/utils";
import { userStore } from "@/store/store";

const NewDm = () => {
  const { SetSelectedChatType, SetSelectedChatData } = userStore();
  const [OpenNewContactMode, setOpenNewContactMode] = useState(false);
  const [SearchContact, setSearchContact] = useState([]);

  const searchContacts = async (searchItem) => {
    try {
      if (searchItem.length > 0) {
        const response = await apiClient.post(
          SEARCH_CONTACTS_ROUTE,
          { searchItem },
          { withCredentials: true }
        );
        if (response.status === 200 && response.data.contacts) {
          setSearchContact(response.data.contacts);
        }
      } else {
        setSearchContact([]);
      }
    } catch (error) {
      console.log({ error });
    }
  };

  const selectNewContact = (contact) => {
    setOpenNewContactMode(false);
    SetSelectedChatType("contact");
    SetSelectedChatData(contact);
    setSearchContact([]);
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-neutral-500 hover:text-neutral-100 cursor-pointer transition-all text-xl"
              onClick={() => setOpenNewContactMode(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1b1c24] border-none mb-4 p-4 text-white text-sm rounded-md shadow-md ">
            Select new contact
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={OpenNewContactMode} onOpenChange={setOpenNewContactMode}>
        <DialogContent className="bg-gradient-to-br from-gray-950 via-gray-800 to-gray-900 border-none text-[#d6d0e4] max-w-md w-full p-8 pt-12 rounded-3xl shadow-2xl fixed flex flex-col items-center justify-center left-1/2  -translate-x-1/2 z-50 " style={{padding:"15px"}}>
          <span className="absolute  left-1/2 -translate-x-1/2 text-5xl animate-bounce select-none">
            💖
          </span>
          <DialogHeader className="w-full flex flex-col items-center">
            <DialogTitle className="text-3xl font-extrabold mb-1 tracking-tight text-center">
              Select a Contact
            </DialogTitle>
            <DialogDescription className="text-base text-[#c5bcd6] mb-4 text-center">
              Start a new conversation with someone special!
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 w-full">
            <input
              type="text"
              placeholder="Search contacts..."
              className="w-full p-4 m-2 h-[45px] rounded-2xl bg-white/90 text-[#2d2346] placeholder:text-[#607bb4] outline-none focus:ring-2 focus:ring-blue-950 transition-all duration-300 shadow-lg text-lg border border-[#e0d7fa]"
              onChange={(e) => searchContacts(e.target.value)}
              style={{ fontWeight: 500 }}
            />
          </div>
          {searchContacts.length > 0 && (
            <ScrollArea className="h-[260px] w-full mt-4">
              <div className="flex flex-col gap-5">
                {SearchContact.map((contacts) => (
                  <div
                    key={contacts._id}
                    onClick={() => selectNewContact(contacts)}
                    className="flex gap-4 items-center cursor-pointer hover:bg-[#18212c] transition-all rounded-xl p-3 shadow-md "
                  >
                    <Avatar className="h-14 w-14 rounded-full overflow-hidden border-2 border-black-400 shadow">
                      {contacts.image ? (
                        <AvatarImage
                          src={`${HOST}/${contacts.image}`}
                          alt="profile"
                          className="object-cover w-full h-full bg-black rounded-full"
                        />
                      ) : (
                        <div
                          className={`uppercase h-14 w-14 text-xl border-[1px] flex items-center justify-center rounded-full ${getColor(
                            contacts.color || ""
                          )}`}
                        >
                          {contacts.firstName
                            ? contacts.firstName.charAt(0)
                            : contacts.email.charAt(0)}
                        </div>
                      )}
                    </Avatar>
                    <div>
                      <span className="font-semibold block text-lg">
                        {contacts.firstName || contacts.lastName
                          ? `${contacts.firstName ?? ""} ${
                              contacts.lastName ?? ""
                            }`
                          : contacts.email}
                      </span>
                      <span className="text-xs text-[#7589ad]">
                        {contacts.email}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
          {SearchContact.length <= 0 && (
            <div className="flex flex-col duration-1000 transition-all justify-center items-center text-center text-[#ebf0f3] opacity-80 mt-8">
              <p className="text-base animate-pulse">Looking for contacts...</p>
              <h3 className="mt-4 text-2xl uppercase font-semibold tracking-wide">
                Hi{" "}
                <span className="text-gray-300">💜</span> Start searching{" "}
                <span className="text-gray-400">contacts</span>
              </h3>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewDm;
