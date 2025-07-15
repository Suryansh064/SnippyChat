import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
  withCredentials: true,
});

const ChatContext = createContext();
export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const [chatToken, setChatToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChatToken = async () => {
      if (!user?._id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await api.get("/api/chat/token");
        setChatToken(res.data.token);
      } catch (err) {
        console.error("Failed to fetch chat token:", err);
        setChatToken(null);
      } finally {
        setLoading(false);
      }
    };

    fetchChatToken();
  }, [user]);

  return (
    <ChatContext.Provider value={{ chatToken, loading }}>
      {children}
    </ChatContext.Provider>
  );
};
