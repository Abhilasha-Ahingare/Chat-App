const EmptyContainer = () => {
  return (
    <div className="flex-1 bg-gradient-to-r from-[#102f36] to-[#1a1a24] md:flex flex-col justify-center items-center hidden duration-1000 transition-all">
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full animate-ping opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full animate-pulse"></div>
        <div className="absolute inset-2 bg-[#1a1a2e] rounded-full"></div>
        <div className="absolute inset-4 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full animate-pulse"></div>
      </div>
      <div className="text-white flex flex-col gap-6 items-center transition-all duration-300 text-center max-w-2xl px-6">
        <h3 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-wide">
          Welcome to{" "}
          <span className="font-medium bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
            Syncronus
          </span>
        </h3>
        <p className="text-gray-400 text-lg md:text-xl">
          Start a conversation or select a chat to begin messaging
        </p>
        <div className="flex gap-3 text-sm text-gray-400 mt-4">
          <span className=" rounded-full bg-white/5 backdrop-blur-sm" style={{padding:"7px 12px"}}>
            Real-time chat
          </span>
          <span className=" rounded-full bg-white/5 backdrop-blur-sm" style={{padding:"7px 12px"}}>
            File sharing
          </span>
          <span className=" rounded-full p-4 bg-white/5 backdrop-blur-sm" style={{padding:"7px 12px"}}>
            Secure
          </span>
        </div>
      </div>
    </div>
  );
};

export default EmptyContainer;
