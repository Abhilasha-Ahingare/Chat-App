import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useState } from "react";
import { apiClient } from "@/lib/api-client";
import { SINGUP_ROUTE, LOGIN_ROUTE } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import { userStore } from "@/store/store";

const Login = () => {
  const [email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { setUserInfo } = userStore();
  const navigate = useNavigate();

  const validationSignup = () => {
    if (!email.length || !Password.length) {
      alert("Please fill all the fields");
      return false;
    }
    if (Password !== confirmPassword) {
      alert("Password and Confirm Password should be same");
      return false;
    }
    return true;
  };

  const handleSigUp = async () => {
    if (validationSignup()) {
      try {
        const response = await apiClient.post(
          SINGUP_ROUTE,
          {
            email,
            password: Password,
          },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        if (response.status === 201) {
          setUserInfo(response.data.user);
          navigate("/profile");
        }
      } catch (error) {
        console.error("Signup error", error.response?.data || error.message);
        alert("Signup failed");
      }
    }
  };

  const handleLogin = async () => {
    try {
      if (!email.length || !Password.length)
        return alert("Please fill all the fields");
      const response = await apiClient.post(
        LOGIN_ROUTE,
        {
          email,
          password: Password,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (response.data.user?.id) {
        setUserInfo(response.data.user);
        if (response.data.user.profileSetup) navigate("/chats");
        else navigate("/profile");
      }
    } catch (error) {
      console.error("Login error", error.response?.data || error.message);
      alert("Login failed");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#052736] to-[#55758a] flex items-center justify-center px-4 py-12">
      <div className="bg-white/5 rounded-3xl shadow-2xl w-full max-w-lg px-10 py-12 relative z-10 flex flex-col items-center gap-8" style={{padding:"15px"}}>
        {/* Logo and Heading */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-20 h-20 bg-gradient-to-r from-indigo-950 to-blue-400 rounded-full flex items-center justify-center shadow-lg mb-2">
            <img src="/your-logo.svg" alt="Logo" className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-extrabold text-indigo-200 text-center">
            Welcome to ChatApp
          </h2>
          <p className="text-indigo-50 text-center text-base font-medium">
            Sign in to your account or create a new one
          </p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="w-full flex justify-between transition-all duration-300  rounded-full p-1 mb-8">
            <TabsTrigger
              value="login"
              className="w-1/2 text-center text-indigo-50 font-semibold rounded-full py-2 transition-all data-[state=active]:bg-white data-[state=active]:shadow data-[state=active]:text-indigo-900"
            >
              Sign In
            </TabsTrigger>
            <TabsTrigger
              value="signup"
              className="w-1/2 text-center text-indigo-50 font-semibold rounded-full py-2 transition-all data-[state=active]:bg-white data-[state=active]:shadow data-[state=active]:text-indigo-900"
            >
              Sign Up
            </TabsTrigger>
          </TabsList>

          {/* Sign In Form */}
          <TabsContent
            value="login"
            className="flex flex-col items-center gap-5 animate-fade-in"
          >
            <div className="w-full flex flex-col gap-4">
              {/* Email Input */}
              <div className="flex gap-4 items-center bg-[#f0f4ff] border border-indigo-200 rounded-full h-[48px] w-full px-4" style={{padding:"15px"}}>
                <span className="text-indigo-400 mr-2 flex-shrink-0">
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" />
                    <path d="M12 14c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4Z" />
                  </svg>
                </span>
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none shadow-none text-indigo-400 text-base placeholder:text-indigo-400"
                />
              </div>
              {/* Password Input */}
              <div className="flex gap-3 items-center bg-[#f0f4ff] border border-indigo-200 rounded-full h-[48px] w-full px-4" style={{padding:"15px"}}>
                <span className="text-indigo-400 mr-2 flex-shrink-0">
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <rect width="12" height="8" x="6" y="11" rx="4" />
                    <path d="M12 15v2" />
                    <path d="M8 11V7a4 4 0 1 1 8 0v4" />
                  </svg>
                </span>
                <Input
                  type="password"
                  placeholder="Password"
                  value={Password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none shadow-none text-indigo-800 text-base placeholder:text-indigo-400"
                />
              </div>
            </div>
            <div className="w-full flex justify-end">
              <a
                href="#"
                className="text-sm text-indigo-50 hover:text-indigo-200 font-medium"
              >
                Forgot password?
              </a>
            </div>
            <Button
              onClick={handleLogin}
              className="w-full rounded-full bg-gradient-to-r from-indigo-950 to-blue-400 hover:from-indigo-500 hover:to-blue-900 py-3 text-white font-semibold shadow-md hover:shadow-lg mt-2 text-lg"
            >
              Sign In
            </Button>
          </TabsContent>

          {/* Sign Up Form */}
          <TabsContent
            value="signup"
            className="flex flex-col items-center gap-5 animate-fade-in"
          >
            <div className="w-full flex flex-col gap-4">
              {/* Email Input */}
              <div className="flex gap-3 items-center bg-[#f0f4ff] border border-indigo-200 rounded-full h-[48px] w-full px-4" style={{padding:"15px"}}>
                <span className="text-indigo-400 mr-2 flex-shrink-0">
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" />
                    <path d="M12 14c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4Z" />
                  </svg>
                </span>
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none shadow-none text-indigo-700 text-base placeholder:text-indigo-400"
                />
              </div>
              {/* Password Input */}
              <div className="flex gap-3 items-center bg-[#f0f4ff] border border-indigo-200 rounded-full h-[48px] w-full px-4" style={{padding:"15px"}}>
                <span className="text-indigo-400 mr-2 flex-shrink-0">
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <rect width="12" height="8" x="6" y="11" rx="4" />
                    <path d="M12 15v2" />
                    <path d="M8 11V7a4 4 0 1 1 8 0v4" />
                  </svg>
                </span>
                <Input
                  type="password"
                  placeholder="Create password"
                  value={Password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none shadow-none text-indigo-700 text-base placeholder:text-indigo-400"
                />
              </div>
              {/* Confirm Password Input */}
              <div className="flex items-center bg-[#f0f4ff] border border-indigo-200 rounded-full h-[48px] gap-3 w-full px-4" style={{padding:"15px"}}>
                <span className="text-indigo-400 mr-2 flex-shrink-0">
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <rect width="12" height="8" x="6" y="11" rx="4" />
                    <path d="M12 15v2" />
                    <path d="M8 11V7a4 4 0 1 1 8 0v4" />
                  </svg>
                </span>
                <Input
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none shadow-none text-indigo-700 text-base placeholder:text-indigo-400"
                />
              </div>
            </div>
            <Button
              onClick={handleSigUp}
              className="w-full rounded-full bg-gradient-to-r from-indigo-950 to-blue-400 hover:from-indigo-900 hover:to-blue-500 py-3 text-white font-semibold shadow-md hover:shadow-lg mt-2 text-lg"
            >
              Sign Up
            </Button>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Login;
