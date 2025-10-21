import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import ChatPage from "./Pages/ChatPage";
import Call from "./Pages/Call";
import OnBoard from "./Pages/OnBoard";
import Notification from "./Pages/Notification";
import Layout from "./components/Layout";
import AiChatPage from "./Pages/AiChatPage";
function App() {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <Routes>
      {!user ? (
        <>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/signup" replace />} />
        </>
      ) : (
        <>
          <Route path="/" element={<Layout showSidebar={true}><Home /></Layout>} />
          <Route path="/onboard" element={<OnBoard />} />
          <Route path="/chatPage/:id" element={<ChatPage />} />
          <Route path="/call/:id" element={<Call />} />
          <Route path="/notifications" element={<Layout showSidebar={true}><Notification /></Layout>} />

          {/* Prevent access to login/signup if already logged in */}
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/signup" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/aiChat/:id" element={<AiChatPage />} />
        </>
      )}
    </Routes>
  );
}

export default App;
