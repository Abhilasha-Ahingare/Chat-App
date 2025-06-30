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
          { email, password: Password },
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
        { email, password: Password },
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
      <div
        className="bg-white/5 rounded-3xl shadow-2xl w-full max-w-lg px-10 py-12 relative z-10 flex flex-col items-center gap-8"
        style={{ padding: "15px" }}
      >
        {/* Logo and Heading */}
        <div className="flex flex-col items-center gap-2">
          <div
            className="w-20 h-20 md:w-24 md:h-24"
            style={{
              background: "linear-gradient(135deg, #1a3a4d 60%, #55758a 100%)",
              borderRadius: "9999px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 24px 0 #05273644",
              marginBottom: "0.5rem",
            }}
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ animation: "spin 3s linear infinite" }}
            >
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="24" y2="24">
                  <stop offset="0%" stopColor="#7f53ff" />
                  <stop offset="100%" stopColor="#ff512f" />
                </linearGradient>
                <style>
                  {`
                    @keyframes spin {
                      100% { transform: rotate(360deg); }
                    }
                  `}
                </style>
              </defs>
              <path
                d="M5 12c0-2.21 1.79-4 4-4 1.54 0 2.88.89 3.5 2.17C13.12 8.89 14.46 8 16 8c2.21 0 4 1.79 4 4s-1.79 4-4 4c-1.54 0-2.88-.89-3.5-2.17C11.88 15.11 10.54 16 9 16c-2.21 0-4-1.79-4-4z"
                stroke="url(#gradient)"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-indigo-200 text-center">
            Welcome to ChatApp
          </h2>
          <p className="text-indigo-50 text-center text-base font-medium">
            Sign in to your account or create a new one
          </p>
        </div>

        {/* Tabs for Login/Signup */}
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="w-full flex justify-between rounded-full p-1 mb-8">
            <TabsTrigger
              value="login"
              className="w-1/2 text-center text-indigo-50 font-semibold rounded-full py-2 data-[state=active]:bg-white data-[state=active]:shadow data-[state=active]:text-indigo-900"
            >
              Sign In
            </TabsTrigger>
            <TabsTrigger
              value="signup"
              className="w-1/2 text-center text-indigo-50 font-semibold rounded-full py-2 data-[state=active]:bg-white data-[state=active]:shadow data-[state=active]:text-indigo-900"
            >
              Sign Up
            </TabsTrigger>
          </TabsList>

          {/* Sign In */}
          <TabsContent
            value="login"
            className="flex flex-col items-center gap-5"
          >
            <div className="w-full flex flex-col gap-4">
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-full bg-[#f0f4ff] border border-indigo-200 h-12 px-6 text-indigo-800 placeholder:text-indigo-400"
                style={{ padding: "16px" }}

              />
              <Input
                type="password"
                placeholder="Password"
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-full bg-[#f0f4ff] border border-indigo-200 h-12 px-6 text-indigo-800 placeholder:text-indigo-400"
                style={{ padding: "16px" }}

              />
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
              className="w-full rounded-full bg-gradient-to-r from-indigo-950 to-blue-400 hover:from-indigo-500 hover:to-blue-900 py-3 text-white font-semibold shadow-md hover:shadow-lg text-lg"
            >
              Sign In
            </Button>
          </TabsContent>

          {/* Sign Up */}
          <TabsContent
            value="signup"
            className="flex flex-col items-center gap-5"
          >
            <div className="w-full flex flex-col gap-4">
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-full bg-[#f0f4ff] border border-indigo-200 h-12 px-6 text-indigo-800 placeholder:text-indigo-400"
                style={{ padding: "16px" }}
              />
              <Input
                type="password"
                placeholder="Create password"
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-full bg-[#f0f4ff] border border-indigo-200 h-12 px-6 text-indigo-800 placeholder:text-indigo-400"
                style={{ padding: "16px" }}

              />
              <Input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="rounded-full bg-[#f0f4ff] border border-indigo-200 h-12 px-6 text-indigo-800 placeholder:text-indigo-400"
                style={{ padding: "16px" }}

              />
            </div>
            <Button
              onClick={handleSigUp}
              className="w-full rounded-full bg-gradient-to-r from-indigo-950 to-blue-400 hover:from-indigo-900 hover:to-blue-500 py-3 text-white font-semibold shadow-md hover:shadow-lg text-lg"
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
