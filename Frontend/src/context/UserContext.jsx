import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
  withCredentials: true,
});

const UserContext = createContext();
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const { user } = useAuth();

  const [friends, setFriends] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/user");
      setAllUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFriends = async () => {
    try {
      const res = await api.get("/api/user/friends");
      setFriends(res.data);
    } catch (err) {
      console.error("Failed to fetch friends:", err);
    }
  };

  const sendFriendRequest = async (id) => {
    try {
      await api.post(`/api/user/friend-req/${id}`);
      getSentRequests();
    } catch (err) {
      console.error("Send request error:", err);
    }
  };

  const acceptFriendRequest = async (id) => {
    try {
      await api.put(`/api/user/friend-req/${id}/accept`);
      fetchFriends();
      getReceivedRequests();
    } catch (err) {
      console.error("Accept request error:", err);
    }
  };

  const getReceivedRequests = async () => {
    try {
      const res = await api.get("/api/user/friend-req");
      setReceivedRequests(res.data);
    } catch (err) {
      console.error("Get received requests error:", err);
    }
  };

  const getSentRequests = async () => {
    try {
      const res = await api.get("/api/user/send-friend-req");
      setSentRequests(res.data);
    } catch (err) {
      console.error("Get sent requests error:", err);
    }
  };

  const onboard = async (data) => {
    try {
      await api.post("/api/auth/onBoard", data);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err?.response?.data?.message || "Onboarding failed",
      };
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchUsers();
      fetchFriends();
      getReceivedRequests();
      getSentRequests();
    }
  }, [user]);

  return (
    <UserContext.Provider
      value={{
        allUsers,
        friends,
        receivedRequests,
        sentRequests,
        fetchUsers,
        fetchFriends,
        sendFriendRequest,
        acceptFriendRequest,
        getReceivedRequests,
        getSentRequests,
        onboard,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
