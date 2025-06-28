import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./Page/Home";
import Login from "./Page/Login";
import Signup from "./Page/Signup";
import ChatPage from "./Page/ChatPage";
import Call from "./Page/Call";
import OnBoard from "./Page/OnBoard";
import Notification from "./Page/Notification"
import Layout from "./components/Layout";
function App() {
  const token = localStorage.getItem("token");

  return (
    <Routes>
      {!token ? (
        <>
          <Route path="*" element={<Navigate to="/signup" replace />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </>
      ) : (
        <>
          <Route path="/" element={<Layout showSidebar={true}><Home /></Layout>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/OnBoard" element={<OnBoard />} />
          <Route path="/chatPage/:id" element={<ChatPage />} />
          <Route path="/call" element={<Call />} />
          <Route path="/notifications" element={<Layout showSidebar={true}><Notification /></Layout>} />
        </>
      )}
    </Routes>
  );
}

export default App;