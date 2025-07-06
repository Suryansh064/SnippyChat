import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext"; 

const useHomeData = () => {
  const {
    friends,
    allUsers,
    sentRequests,
    fetchFriends,
    fetchUsers,
    getSentRequests,
    sendFriendRequest,
  } = useUser();

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState({});

  const outgoingRequestsIds = new Set(
    sentRequests.map(r => r?.recipient?._id).filter(Boolean)
  );

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchFriends(), fetchUsers(), getSentRequests()]);
      } catch (err) {
        console.error("Failed to fetch home data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleSendRequest = async (userId) => {
    setSending(prev => ({ ...prev, [userId]: true }));
    await sendFriendRequest(userId);
    setSending(prev => ({ ...prev, [userId]: false }));
  };

  return {
    friends,
    recommendedUsers: allUsers,
    outgoingRequestsIds,
    loadingFriends: loading,
    loadingUsers: loading,
    sending,
    sendFriendRequest: handleSendRequest,
  };
};

export default useHomeData;
