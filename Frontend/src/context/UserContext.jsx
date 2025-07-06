import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext"; // ✅ Correct import

const UserContext = createContext();
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const { token, user } = useAuth();

  const [friends, setFriends] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const axiosConfig = {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  //  Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/api/user`,
        axiosConfig
      );
      setAllUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  //  Fetch friend list
  const fetchFriends = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/api/user/friends`,
        axiosConfig
      );
      setFriends(res.data);
    } catch (err) {
      console.error("Failed to fetch friends:", err);
    }
  };

  //  Send a friend request
  const sendFriendRequest = async (id) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/api/user/friend-req/${id}`,
        {},
        axiosConfig
      );
      getSentRequests(); // Refresh sent list
    } catch (err) {
      console.error("Send request error:", err);
    }
  };

  //  Accept a friend request
  const acceptFriendRequest = async (id) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/api/user/friend-req/${id}/accept`,
        {},
        axiosConfig
      );
      fetchFriends();
      getReceivedRequests();
    } catch (err) {
      console.error("Accept request error:", err);
    }
  };

  //  Get received friend requests
  const getReceivedRequests = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/api/user/friend-req`,
        axiosConfig
      );
      setReceivedRequests(res.data);
    } catch (err) {
      console.error("Get received requests error:", err);
    }
  };

  //  Get sent friend requests
  const getSentRequests = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/api/user/send-friend-req`,
        axiosConfig
      );
      setSentRequests(res.data);
    } catch (err) {
      console.error("Get sent requests error:", err);
    }
  };

  //  Onboarding profile
  const onBoard = async (data) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/onBoard`,
        data,
        { withCredentials: true }
      );
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err?.response?.data?.message || "Onboarding failed",
      };
    }
  };

  //  Auto-fetch when logged in
  useEffect(() => {
    if (token) {
      fetchUsers();
      fetchFriends();
      getReceivedRequests();
      getSentRequests();
    }
  }, [token]);

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
        onBoard,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
