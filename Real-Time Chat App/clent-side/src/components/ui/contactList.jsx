import { getColor } from "@/lib/utils";
import ContactsContainer from "@/pages/chats/contacts-contaier/ContactsContainer";
import { userStore } from "@/store/store";
import { HOST } from "@/utils/constants";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import React, { useState } from "react";

const ContactList = ({ contacts, isChannel = false }) => {
  const selectedChatData = userStore((state) => state.selectedChatData);
  const setSelectedChatType = userStore((state) => state.SetSelectedChatType);
  const setSelectedChatData = userStore((state) => state.SetSelectedChatData);
  const setSelectedChatMessages = userStore(
    (state) => state.SetSelectedChatMessages
  );
  const setShowContacts = userStore(state => state.setShowContacts);

  

const handleClick = (contact) => {
  setSelectedChatData(contact);
  setSelectedChatType(isChannel ? "channel" : "contact");
  setSelectedChatMessages([]);

  if (window.innerWidth < 500) {
    setShowContacts(false);
  }
};

  return (
    <div className="flex flex-col gap-4" style={{ marginLeft: "9px" }}>
      {contacts.map((constants) => {
        const isSelected =
          selectedChatData && selectedChatData._id === constants._id;
        return (
          <div
            key={constants._id}
            onClick={() => handleClick(constants)}
            className={
              `px-4 py-3 transition-all duration-300 cursor-pointer rounded-xl group ` +
              (isSelected
                ? "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 shadow-lg"
                : "hover:bg-white/5")
            }
          >
            <div className="flex gap-3 items-center text-neutral-300 p-4 m-4">
              {!isChannel && (
                <div className="relative flex items-center justify-center">
                  <div className="relative mr-3">
                    <Avatar className="h-9 w-9 rounded-full overflow-hidden ring-2 ring-white/10 ring-offset-2 ring-offset-[#1a1a2e] transition-all duration-300 group-hover:ring-indigo-500/30 flex items-center justify-center">
                      {constants.image ? (
                        <AvatarImage
                          src={`${HOST}/${constants.image}`}
                          alt="profile"
                          className="object-cover h-8 w-8 rounded-full group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div
                          className={
                            (isSelected
                              ? "bg-white/20 border-2 border-white/40"
                              : `${getColor(
                                  constants.color || ""
                                )} border-2 border-white/10`) +
                            " uppercase h-8 w-8 text-xs flex items-center justify-center rounded-full transition-all duration-300 backdrop-blur-sm font-medium tracking-wide"
                          }
                        >
                          {constants.firstName
                            ? constants.firstName.charAt(0)
                            : constants.email.charAt(0)}
                        </div>
                      )}
                    </Avatar>
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#1a1a2e]"></div>
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-600 rounded-full border-2 border-[#1a1a2e]"></div>
                </div>
              )}

              {isChannel && (
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500/20 to-blue-500/20 border border-white/10 text-xl font-semibold text-white/90">
                  start chat
                </div>
              )}

              <div className="flex flex-col">
                {isChannel ? (
                  <span className="font-medium text-white group-hover:text-white/90 transition-colors">
                    {constants.name}
                  </span>
                ) : (
                  <>
                    <span className="font-medium text-white group-hover:text-white/90 transition-colors">
                      {`${constants.firstName} ${constants.lastName}`}
                    </span>
                    <span className="text-sm text-gray-400">Active now</span>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ContactList;
