import { Button } from "@/components/ui/button"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import Login from "./pages/auth/Login"
import Profile from "./pages/profile/Profile"
import Chats from "./pages/chats/Chats"
import { userStore } from "./store/store"
import { useEffect, useState } from "react"
import { apiClient } from "./lib/api-client"
import { GET_USER_INFO } from "./utils/constants"

const PrivateRoute = ({ children }) => {
  const { userInfo } = userStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to="/login" />
}

const AuthRoute = ({ children }) => {
  const { userInfo } = userStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to="/chats" /> : children
}

function App() {
  const { userInfo, setUserInfo } = userStore();
  const [Loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await apiClient.get(GET_USER_INFO, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
  
        if (response.status === 200 && response.data?.id) {
          setUserInfo(response.data);
        } else {
          setUserInfo(null); 
        }
      } catch (error) {
        setUserInfo(null);
      } finally {
        setLoading(false);
      }
    };
  
    if (!userInfo) {
      getUserData();
    } else {
      setLoading(false);
    }
  }, [userInfo, setUserInfo]);
  
  
  if (Loading) {
    return <div>loading.....</div>
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={
          <AuthRoute>
            <Login />
           </AuthRoute>
        } />
        <Route path="/chats" element={
          <PrivateRoute>
            <Chats />
          </PrivateRoute>} />
        <Route path="/profile" element={
          <PrivateRoute>

            <Profile />
          </PrivateRoute>
        } />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
