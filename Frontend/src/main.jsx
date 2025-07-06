import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; 
import { UserProvider } from "./context/UserContext";
import { ChatProvider } from "./context/ChatContext";
import  "./index.css"
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <UserProvider>
          <ChatProvider>
          <App />
          </ChatProvider>
        </UserProvider> 
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
