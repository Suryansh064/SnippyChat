import { useEffect, useState } from "react";
import axios from "axios";
import { BellIcon, ClockIcon, MessageSquareIcon, UserCheckIcon } from "lucide-react";

function NoNotificationsFound() {
    return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="size-16 rounded-full bg-base-300 flex items-center justify-center mb-4">
        <BellIcon className="size-8 text-base-content opacity-40" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No notifications yet</h3>
        <p className="text-base-content opacity-70 max-w-md">
        When you receive friend requests or messages, they'll appear here.
        </p>
    </div>
);
}

const Notification = () => {
    const [loading, setLoading] = useState(true);
    const [friendRequests, setFriendRequests] = useState({ incomingReqs: [], acceptedReqs: [] });
    const [accepting, setAccepting] = useState({});

useEffect(() => {
    setLoading(true);
    axios.get("http://localhost:5001/api/user/friend-req", { withCredentials: true })
    .then(res => {
        if (res.data && typeof res.data === "object") {
        setFriendRequests({
            incomingReqs: res.data.incoming || [],
            acceptedReqs: res.data.accepted || [],
        });
    } else {
        setFriendRequests({ incomingReqs: [], acceptedReqs: [] });
    }
    })
    .finally(() => setLoading(false));
}, []);
    const acceptFriendRequest = async (id) => {
    setAccepting(prev => ({ ...prev, [id]: true }));
    try {
        await axios.put(`http://localhost:5001/api/user/friend-req/${id}/accept`, {}, { withCredentials: true });
      // Refresh requests after accepting
        const res = await axios.get("http://localhost:5001/api/user/friend-req", { withCredentials: true });
        if (res.data && typeof res.data === "object") setFriendRequests(res.data);
    } catch (e) {}
    setAccepting(prev => ({ ...prev, [id]: false }));
};

    const incomingRequests = friendRequests.incomingReqs || [];
    const acceptedRequests = friendRequests.acceptedReqs || [];

    return (
    <div className="p-4 sm:p-6 lg:p-8">
        <div className="container mx-auto max-w-4xl space-y-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">Notifications</h1>

        {loading ? (
        <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
        </div>
        ) : (
        <>
            {incomingRequests.length > 0 && (
            <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                <UserCheckIcon className="h-5 w-5 text-primary" />
                Friend Requests
                <span className="badge badge-primary ml-2">{incomingRequests.length}</span>
                </h2>
                <div className="space-y-3">
                {incomingRequests.map((request) => (
                    <div key={request._id} className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="card-body p-4">
                        <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="avatar w-14 h-14 rounded-full bg-base-300">
                            <img src={request.sender.profilePic} alt={request.sender.fullName} />
                            </div>
                            <div>
                            <h3 className="font-semibold">{request.sender.fullName}</h3>
                            <div className="flex flex-wrap gap-1.5 mt-1">
                                <span className="badge badge-secondary badge-sm">
                                Native: {request.sender.nativeLanguage}
                                </span>
                                <span className="badge badge-outline badge-sm">
                                Learning: {request.sender.learningLanguage}
                                </span>
                            </div>
                            </div>
                        </div>
                    <button
                            className="btn btn-primary btn-sm"
                            onClick={() => acceptFriendRequest(request._id)}
                            disabled={accepting[request._id]}
                        >
                            Accept
                        </button>
                        </div>
                    </div>
                    </div>
                ))}
                </div>
            </section>
            )}

            {acceptedRequests.length > 0 && (
            <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                <BellIcon className="h-5 w-5 text-success" />
                New Connections
                </h2>
                <div className="space-y-3">
                {acceptedRequests.map((notification) => (
                    <div key={notification._id} className="card bg-base-200 shadow-sm">
                <div className="card-body p-4">
                        <div className="flex items-start gap-3">
                        <div className="avatar mt-1 size-10 rounded-full">
                            <img
                                src={notification.receiver.profilePic}
                                alt={notification.receiver.fullName}
                            />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold">{notification.receiver.fullName}</h3>
                            <p className="text-sm my-1">
                            {notification.receiver.fullName} accepted your friend request
                            </p>
                            <p className="text-xs flex items-center opacity-70">
                            <ClockIcon className="h-3 w-3 mr-1" />
                            Recently
                            </p>
                        </div>
                    <div className="badge badge-success">
                            <MessageSquareIcon className="h-3 w-3 mr-1" />
                            New Friend
                        </div>
                        </div>
                    </div>
                    </div>
                ))}
                </div>
            </section>
            )}

            {incomingRequests.length === 0 && acceptedRequests.length === 0 && (
            <NoNotificationsFound />
            )}
        </>
        )}
    </div>
    </div>
);
}

export default Notification

