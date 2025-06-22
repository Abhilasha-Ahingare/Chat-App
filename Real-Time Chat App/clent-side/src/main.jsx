import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { SocketProvider } from "./context/SocketContext";
// import { ToastContainer } from 'react-toastify'

createRoot(document.getElementById("root")).render(
  <StrictMode>
      <SocketProvider>
      <App />
      {/* <ToastContainer> */}
      {/* </ToastContainer> */}
  </SocketProvider>
    </StrictMode>
);
