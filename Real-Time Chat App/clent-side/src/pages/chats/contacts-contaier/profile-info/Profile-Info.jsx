import React from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { userStore } from "@/store/store";
import { HOST, LOGOUT_ROUTER } from "@/utils/constants";
import { getColor } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FiEdit2 } from "react-icons/fi";
import { IoPowerSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { apiClient } from "@/lib/api-client";

const ProfileInfo = () => {
  const { userInfo, setUserInfo } = userStore();
  const navigate = useNavigate();

  const LogOut = async () => {
    try {
      const response = await apiClient.post(
        LOGOUT_ROUTER,
        {},
        { withCredentials: true }
      );
      if (response.status === 200) {
        navigate("login");
        setUserInfo(null);
      }
    } catch (error) {}
  };

  return (
    <div className="h-20 flex items-center justify-between px-4 w-full bg-[#15282c]  flex-wrap">
      {/* Profile section */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 gap-2 space-x-1">
          <Avatar className="h-12 w-12 rounded-full overflow-hidden border-2 border-white/10">
            {userInfo.image ? (
              <AvatarImage
                src={`${HOST}/${userInfo.image}`}
                alt="profile"
                className="object-cover w-full h-full rounded-full"
              />
            ) : (
              <div
                className={`uppercase h-12 w-12 text-lg flex items-center justify-center rounded-full ${getColor(
                  userInfo.color
                )}`}
              >
                {userInfo.firstName
                  ? userInfo.firstName.charAt(0)
                  : userInfo.email.charAt(0)}
              </div>
            )}
          </Avatar>
        </div>
        <div className="ml-2 text-white font-medium text-base">
          {userInfo.firstName || userInfo.lastName
            ? `${userInfo.firstName ?? ""} ${userInfo.lastName ?? ""}`
            : ""}
        </div>
      </div>

      {/* Actions section with improved tooltip */}
      <TooltipProvider>
        <div className="flex gap-6">
          {/* Edit Icon Tooltip */}
          <Tooltip>
            <TooltipTrigger asChild>
              <FiEdit2
                className="text-gray-300 text-xl cursor-pointer"
                onClick={() => navigate("/profile")}
              />
            </TooltipTrigger>
            <TooltipContent
              side="top"
              sideOffset={8}
              hideArrow
              className="bg-[#2b2d36] border-none text-white text-sm p-6 rounded-md shadow-md"
            >
              <p>Edit Profile</p>
            </TooltipContent>
          </Tooltip>

          {/* Logout Icon Tooltip */}
          <Tooltip>
            <TooltipTrigger asChild>
              <IoPowerSharp
                className="text-red-500 text-xl cursor-pointer"
                onClick={LogOut}
              />
            </TooltipTrigger>
            <TooltipContent
              side="top"
              sideOffset={8}
              hideArrow
              className="bg-[#2b2d36] border-none text-white text-sm p-6 rounded-md shadow-md"
            >
              <p>Log Out</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );
};

export default ProfileInfo;
