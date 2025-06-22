import React, { useEffect, useState } from "react";
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
import {
  CREATE_CHANNEL_ROUTE,
  GET_ALL_CONTACTS_ROUTES,
} from "@/utils/constants";
import { userStore } from "@/store/store";
import { Button } from "@/components/ui/button";
import MultipleSelector from "@/components/ui/multiple-selector";

const CreateChannel = () => {
  const { SetSelectedChatType, SetSelectedChatData, addChannel } = userStore();
  const [newChannelModel, setNewChannelModel] = useState(false);
  const [allContact, setAllContact] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [channelName, setChannelName] = useState("");

  useEffect(() => {
    const getData = async () => {
      const response = await apiClient.get(GET_ALL_CONTACTS_ROUTES, {
        withCredentials: true,
      });
      setAllContact(response.data.contacts);
    };
    getData();
  }, []);

  const createChannel = async () => {
    try {
      if (channelName.length > 0 && selectedContacts.length > 0) {
        const response = await apiClient.post(
          CREATE_CHANNEL_ROUTE,
          {
            name: channelName,
            members: selectedContacts.map((contacts) => contacts.value),
          },
          { withCredentials: true }
        );

        if (response.status === 201) {
          setChannelName("");
          setSelectedContacts([]);
          setNewChannelModel(false);
          addChannel(response.data.channel);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-neutral-500 hover:text-neutral-100 cursor-pointer transition-all text-xl"
              onClick={() => setNewChannelModel(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1b1c24] border-none mb-2 p-3 text-white text-sm rounded-md shadow-md">
            Create New Channel
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={newChannelModel} onOpenChange={setNewChannelModel}>
        <DialogContent className="bg-[#1b1c24] border border-neutral-700 text-white max-w-md w-full p-6 rounded-2xl shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold mb-1">
              Please fill up the details for new channel
            </DialogTitle>
            <DialogDescription className="text-sm text-neutral-400 mb-4" />
          </DialogHeader>

          <div className="mt-3">
            <input
              type="text"
              placeholder="channel name..."
              className="w-full px-5 py-3 rounded-xl bg-[#272832] text-white placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-purple-600 transition-all duration-300 shadow-md hover:shadow-lg"
              onChange={(e) => setChannelName(e.target.value)}
              value={channelName}
            />
          </div>
          <div>
            {/* <MultipleSelector
              className="rounded-lg bg-[#2c2e3b] border-none py-2 text-white"
              defaultOptions={allContact}
              placeholder="Search contacts"
              value={selectedContacts}
              onChange={setSelectedContacts}
              emptyIndicator={<p className="text-center text-lg leading-10 text-gray-600">no results found</p>}
            /> */}
            <MultipleSelector
              defaultOptions={allContact}
              placeholder="Select frameworks you like..."
              value={selectedContacts}
              onChange={setSelectedContacts}
              emptyIndicator={
                <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                  no results found.
                </p>
              }
            />
          </div>
          <div>
            <Button
              className="w-full bg-purple-700 hover:bg-purple-700 transition-all duration-300"
              onClick={createChannel}
            >
              Create Channel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateChannel;
