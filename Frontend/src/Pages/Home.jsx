import { Link } from "react-router-dom";
import { UsersIcon } from "lucide-react";
import useHomeData from "../hooks/UseHome";
import { FriendCard, SectionHeader } from "../components/HomeCard";
import RecommendedUserCard from "../components/RecommendUser";

const Home = () => {
  const {
    friends,
    recommendedUsers,
    loadingFriends,
    loadingUsers,
    sending,
    sendFriendRequest,
  } = useHomeData();

  return (
    <div className="p-4 sm:p-6 lg:p-10 bg-base-100 min-h-screen text-base-content">
      <div className="container mx-auto space-y-12">

        {/* === Friends Section === */}
        <div className="space-y-6">
          <SectionHeader
            title="Your Friends"
            action={
              <Link to="/notifications" className="btn btn-outline btn-sm gap-2">
                <UsersIcon className="size-4" />
                Friend Requests
              </Link>
            }
          />

          {loadingFriends ? (
            <div className="flex justify-center py-10">
              <span className="loading loading-spinner loading-lg text-primary" />
            </div>
          ) : friends.length === 0 ? (
            <div className="text-center py-10">
              <h3 className="text-lg font-semibold">No friends yet</h3>
              <p className="text-base-content/70">You haven’t connected with anyone yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {friends.map(friend => (
                <FriendCard key={friend._id} friend={friend} />
              ))}
            </div>
          )}
        </div>

        <div className="divider" />

        {/* === Recommended Users Section === */}
        <div className="space-y-6">
          <SectionHeader
            title="Meet New Learners"
            subtitle="Discover language exchange partners based on your interests"
          />

          {loadingUsers ? (
            <div className="flex justify-center py-10">
              <span className="loading loading-spinner loading-lg text-primary" />
            </div>
          ) : recommendedUsers.length === 0 ? (
            <div className="card bg-base-200 p-8 text-center shadow">
              <h3 className="text-lg font-semibold mb-2">No recommendations available</h3>
              <p className="text-base-content/70">
                Try updating your profile or check back later for new matches!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedUsers.map(user => (
                user?._id && (
                  <RecommendedUserCard
                    key={user._id}
                    user={user}
                    sending={sending[user._id]}
                    onSendRequest={sendFriendRequest}
                  />
                )
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
