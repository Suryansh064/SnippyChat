import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext"; // ✅ make sure this is correct

const ChatContext = createContext();
export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const [chatToken, setChatToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChatToken = async () => {
      if (!user?._id) return;

      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_BASE_URL}/api/chat/token`,
          { withCredentials: true }
        );
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
