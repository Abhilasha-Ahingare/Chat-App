import Chatheader from "./components/Chat-header";
import MessageBar from "./components/MessageBar";
import MessagesContainer from "./components/MessagesContainer";

const ChatsContsiner = () => {
  return (
    <div className="flex flex-col flex-1 h-full bg-[#0d1721]">
      <Chatheader />
      <MessagesContainer />
      <MessageBar />
    </div>
  );
};

export default ChatsContsiner;
