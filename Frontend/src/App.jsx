import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./Page/Home";
import Login from "./Page/Login";
import Signup from "./Page/Signup";
import ChatPage from "./Page/ChatPage";
import Call from "./Page/Call";
import OnBoard from "./Page/OnBoard";
import Notification from "./Page/Notification"
function App() {
  const token = localStorage.getItem("token");

  return (
    <Routes>
      {!token ? (
        <>
          <Route path="*" element={<Navigate to="/signin" replace />} />
          <Route path="/signin" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </>
      ) : (
        <>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signin" element={<Signup />} />
          <Route path="/OnBoard" element={<OnBoard />} />
          <Route path="/chatPage/:id" element={<ChatPage />} />
          <Route path="/call" element={<Call />} />
          <Route path="/notifications" element={<Notification />} />
        </>
      )}
    </Routes>
  );
}

export default App;