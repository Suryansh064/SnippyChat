import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import ChatPage from "./Pages/ChatPage";
import Call from "./Pages/Call";
import OnBoard from "./Pages/OnBoard";
import Notification from "./Pages/Notification"
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
          <Route path="/call/:id" element={<Call />} />
          <Route path="/notifications" element={<Layout showSidebar={true}><Notification /></Layout>} />
        </>
      )}
    </Routes>
  );
}

export default App;