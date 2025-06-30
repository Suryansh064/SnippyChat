import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircleIcon, MapPinIcon, UserPlusIcon, UsersIcon } from "lucide-react";
import axios from "axios";

const Home = () => {
  const [friends, setFriends] = useState([]);
  const [recommendedUsers, setRecommendedUsers] = useState([]);
  const [outgoingFriendReqs, setOutgoingFriendReqs] = useState([]);
  const [loadingFriends, setLoadingFriends] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [sending, setSending] = useState({});
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());

  useEffect(() => {
  axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/user/friends`, { withCredentials: true })
    .then(res => {
      if (Array.isArray(res.data)) setFriends(res.data);
      else if (res.data && Array.isArray(res.data.Friends)) setFriends(res.data.Friends);
      else setFriends([]);
    })
    .finally(() => setLoadingFriends(false));

  axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/user/`, { withCredentials: true })
    .then(res => {
      if (Array.isArray(res.data)) setRecommendedUsers(res.data);
      else if (res.data && Array.isArray(res.data.users)) setRecommendedUsers(res.data.users);
      else setRecommendedUsers([]);
    })
    .finally(() => setLoadingUsers(false));

  axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/user/send-friend-req`, { withCredentials: true })
    .then(res => {
      if (Array.isArray(res.data)) setOutgoingFriendReqs(res.data);
      else if (res.data && Array.isArray(res.data.requests)) setOutgoingFriendReqs(res.data.requests);
      else setOutgoingFriendReqs([]);
    });
}, []);

  useEffect(() => {
  const ids = new Set(
    outgoingFriendReqs
      .filter(req => req && req.recipient && req.recipient._id)
      .map(req => req.recipient._id)
  );
  setOutgoingRequestsIds(ids);
}, [outgoingFriendReqs]);

  const sendFriendRequest = async (userId) => {
  setSending(prev => ({ ...prev, [userId]: true }));
  try {
    await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/user/friend-req/${userId}`, {}, { withCredentials: true });
    setOutgoingRequestsIds(prev => new Set(prev).add(userId));
  } catch (e) {}
  setSending(prev => ({ ...prev, [userId]: false }));
};

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold">Your Friends</h2>
          <Link to="/notifications" className="btn btn-outline btn-sm">
            <UsersIcon className="mr-2 size-4" />
            Friend Requests
          </Link>
        </div>

      {loadingFriends ? (
        <div className="flex justify-center py-12">
          <span className="loading loading-spinner loading-lg" />
        </div>
          ) : friends.length === 0 ? (
        <div>No friends found.</div>
        ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {friends.map(friend => (
            <div key={friend._id} className="card bg-base-200 p-4 flex flex-col gap-2">
            <span>{friend.fullName}</span>
          <Link to={`/chatPage/${friend._id}`} className="btn btn-primary btn-sm mt-2">
            Chat
          </Link>
        </div>
    ))}
  </div>
)}
        <section>
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold">Meet New Learners</h2>
                <p className="opacity-70">Discover perfect language exchange partners based on your profile</p>
              </div>
            </div>
          </div>

          {loadingUsers ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : recommendedUsers.length === 0 ? (
            <div className="card bg-base-200 p-6 text-center">
              <h3 className="font-semibold text-lg mb-2">No recommendations available</h3>
              <p className="text-base-content opacity-70">
                Check back later for new language partners!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedUsers.map(user => {
                if (!user || !user._id) {
                console.warn(`Skipping invalid user at index ${i}:`, user);
                return null;
                }
                const hasRequestBeenSent = outgoingRequestsIds.has(user._id);
                return (
                  <div key={user._id} className="card bg-base-300 hover:shadow-lg">
                    <div className="card-body p-5 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="avatar size-16 rounded-full">
                          <img src={user.profilePic} alt={user.fullName} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{user.fullName}</h3>
                          {user.location && (
                            <div className="flex items-center text-xs opacity-70 mt-1">
                              <MapPinIcon className="size-3 mr-1" />
                              {user.location}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-row gap-10 ">
                        <span className="badge badge-outline p-4">Native: {user.nativeLanguage}</span>
                        <span className="badge badge-outline p-4 ">Learning: {user.learningLanguage}</span>
                      </div>

                      {user.bio && <p className="text-sm opacity-70">{user.bio}</p>}

                      <button
                        className={`btn w-full mt-2 ${hasRequestBeenSent ? "btn-disabled" : "btn-primary"}`}
                        onClick={() => sendFriendRequest(user._id)}
                        disabled={hasRequestBeenSent || sending[user._id]}
                      >
                        {hasRequestBeenSent ? (
                          <>
                            <CheckCircleIcon className="size-4 mr-2" />
                            Request Sent
                          </>
                        ) : (
                          <>
                            <UserPlusIcon className="size-4 mr-2" />
                            Send Friend Request
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;