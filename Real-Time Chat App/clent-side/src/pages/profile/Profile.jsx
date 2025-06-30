import { userStore } from "@/store/store";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { FaTrash, FaPlus } from "react-icons/fa";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { colors, getColor } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api-client";
import {
  ADD_PROFILE_IMAGE,
  REMOVE_PROFILE_IMAGE,
  UPDATE_PROFILE,
} from "@/utils/constants";

const Profile = () => {
  const { userInfo, setUserInfo } = userStore();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState("");
  const [hovered, setHovered] = useState(false);
  const [color, setColor] = useState(0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (userInfo) {
      setFirstName(userInfo.firstName || "");
      setLastName(userInfo.lastName || "");
      setColor(userInfo.color || 0);
      // 🔥 Fix image url so it shows on edit page
      setImage(
        userInfo.image ? `http://localhost:5000/${userInfo.image}` : ""
      );
    }
  }, [userInfo]);

  if (!userInfo) {
    return <div className="text-white text-lg p-10">Redirecting to login...</div>;
  }

  const saveChanges = async () => {
    if (!firstName || !lastName) {
      return alert("First name and last name are required.");
    }
    try {
      const response = await apiClient.put(
        UPDATE_PROFILE,
        { firstName, lastName, color },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.status === 200 && response.data) {
        setUserInfo({ ...response.data });
        alert("Profile updated successfully!");
        navigate("/chats");
      }
    } catch (error) {
      console.error("Profile update failed:", error);
      alert("Failed to update profile.");
    }
  };

  const handleInputClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("profile-image", file);

      try {
        const response = await apiClient.post(ADD_PROFILE_IMAGE, formData, {
          withCredentials: true,
        });

        if (response.status === 200 && response.data.image) {
          const fullImageUrl = `http://localhost:5000/${response.data.image}`;
          setImage(fullImageUrl);
          setUserInfo((prev) => ({ ...prev, image: response.data.image }));
          alert("Profile image updated!");
        }
      } catch (error) {
        console.error("Image upload failed:", error);
        alert("Something went wrong while uploading the image.");
      }
    }
  };

  const handleImageDelete = async () => {
    try {
      const response = await apiClient.delete(REMOVE_PROFILE_IMAGE, {
        withCredentials: true,
      });

      if (response.status === 200) {
        setImage("");
        setUserInfo((prev) => ({ ...prev, image: null }));
        alert("Profile image deleted!");
      }
    } catch (error) {
      console.log("Error deleting image:", error);
      alert("Failed to delete image.");
    }
  };

  const handleNavigate = () => {
    if (userInfo?.profileSetup) navigate("/chats");
    else alert("Please setup your profile first.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#143644] to-[#1a1a24] flex items-center justify-center py-10">
      <div className="flex flex-col gap-8 w-[90vw] md:w-[60vw] lg:w-[40vw] bg-white/5 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/10 p-6">
        <div onClick={handleNavigate} className="cursor-pointer">
          <IoArrowBack className="text-3xl text-white/80 hover:text-indigo-400 transition-all duration-300 transform hover:scale-110" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div
            className="h-full w-32 md:w-48 md:h-48 relative flex items-center justify-center group"
            style={{ minWidth: "8rem" }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Avatar className="h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden shadow-2xl ring-4 ring-indigo-400/20 ring-offset-4 ring-offset-[#1a1a2e] transition-all duration-300 group-hover:ring-indigo-400/40 p-2 bg-white/10">
              {image ? (
                <AvatarImage
                  src={image}
                  alt="profile"
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                />
              ) : (
                <div
                  className={`uppercase h-32 w-32 md:w-48 md:h-48 text-6xl border-2 border-white/10 flex items-center justify-center rounded-full transition-all duration-300 backdrop-blur-sm ${getColor(
                    color
                  )}`}
                >
                  {firstName
                    ? firstName.charAt(0)
                    : userInfo.email.charAt(0)}
                </div>
              )}
            </Avatar>
            {hovered && (
              <div
                className="absolute inset-0 flex justify-center items-center bg-black/60 backdrop-blur-sm rounded-full cursor-pointer transition-opacity duration-300"
                onClick={image ? handleImageDelete : handleInputClick}
              >
                {image ? (
                  <FaTrash className="text-white text-4xl transform hover:scale-110 hover:text-red-400 transition-all duration-300" />
                ) : (
                  <FaPlus className="text-white text-4xl transform hover:scale-110 hover:text-indigo-400 transition-all duration-300" />
                )}
              </div>
            )}
            <Input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
              name="profile-image"
              accept=".png, .jpg, .jpeg, .svg, .webp"
            />
          </div>

          <div className="flex flex-col gap-5 text-white items-center justify-center w-full">
            <Input
              type="email"
              placeholder="Email"
              disabled
              value={userInfo.email}
              className="rounded-xl bg-white/5 border border-white/10 text-white/90 text-center shadow-lg px-8 py-8 text-lg focus:border-indigo-500/30 transition-all duration-300 backdrop-blur-sm w-full max-w-xs md:max-w-sm"
            />
            <Input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="rounded-xl bg-white/5 border border-white/10 text-white/90 text-center shadow-lg px-6 py-7 text-lg focus:border-indigo-500/30 transition-all duration-300 backdrop-blur-sm w-full max-w-xs md:max-w-sm"
            />
            <Input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="rounded-xl bg-white/5 border border-white/10 text-white/90 text-center shadow-lg px-6 py-7 text-lg focus:border-indigo-500/30 transition-all duration-300 backdrop-blur-sm w-full max-w-xs md:max-w-sm"
            />
            <div className="flex gap-4 flex-wrap justify-center">
              {colors.map((clr, index) => (
                <div
                  key={index}
                  className={`${clr} h-10 w-10 rounded-3xl cursor-pointer transition-all duration-300 transform hover:scale-110 ${
                    color === index
                      ? "ring-2 ring-white ring-offset-2 ring-offset-[#1a1a2e] shadow-lg"
                      : ""
                  }`}
                  onClick={() => setColor(index)}
                ></div>
              ))}
            </div>
          </div>
        </div>

        <Button
          onClick={saveChanges}
          className="h-16 w-full bg-gradient-to-r from-gray-900 to-gray-700 hover:from-gray-800 hover:to-gray-600 transition-all duration-300 text-white text-xl font-medium tracking-wide rounded-xl shadow-lg transform hover:scale-[1.02] border border-gray-800"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default Profile;
